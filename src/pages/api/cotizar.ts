import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { quoteFormSchema } from '@/lib/form-schema';
import { SITE_CONFIG } from '@/config/site';

export const prerender = false;

async function verifyTurnstile(token: string, secret: string | undefined): Promise<boolean> {
  if (!secret) return true; // En desarrollo local sin secret configurado
  if (!token) return false;

  const formData = new URLSearchParams();
  formData.append('secret', secret);
  formData.append('response', token);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData,
  });
  const data = (await res.json()) as { success?: boolean };
  return Boolean(data.success);
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const parsed = quoteFormSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({
          ok: false,
          message: 'Revisa los campos ingresados.',
          errors: parsed.error.flatten().fieldErrors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const data = parsed.data;
    const turnstileOk = await verifyTurnstile(
      data.turnstileToken,
      import.meta.env.TURNSTILE_SECRET_KEY,
    );

    if (!turnstileOk) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Verificación de seguridad inválida. Intenta nuevamente.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // 1. Persistencia en Supabase (si las variables están configuradas)
    const supabaseUrl = import.meta.env.SUPABASE_URL;
    const supabaseKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error: dbError } = await supabase.from('quote_requests').insert({
        project_type: data.projectType,
        features: data.features,
        problem_summary: data.problemSummary,
        timeline: data.timeline,
        budget_range: data.budgetRange,
        full_name: data.fullName,
        company: data.company,
        whatsapp: data.whatsapp,
        email: data.email,
        source_url: data.sourceUrl,
      });
      if (dbError) {
        console.error('Supabase insert error:', dbError.message);
      }
    }

    // 2. Envío de correos vía Resend
    const resendKey = import.meta.env.RESEND_API_KEY;
    const fromEmail = import.meta.env.RESEND_FROM_EMAIL || `WSAICO <${SITE_CONFIG.contact.email}>`;
    if (resendKey) {
      const resend = new Resend(resendKey);
      const cleanPhone = data.whatsapp.replace(/[^\d]/g, '');

      await Promise.all([
        resend.emails.send({
          from: fromEmail,
          to: [SITE_CONFIG.contact.email],
          replyTo: data.email,
          subject: `Nueva cotización: ${data.projectType} — ${data.fullName}`,
          html: `
            <h2>Nueva solicitud desde wsaico.com</h2>
            <p><strong>Cliente:</strong> ${data.fullName} ${data.company ? `(${data.company})` : ''}</p>
            <p><strong>Correo:</strong> ${data.email}</p>
            <p><strong>WhatsApp:</strong> <a href="https://wa.me/${cleanPhone}">${data.whatsapp}</a></p>
            <p><strong>Tipo de proyecto:</strong> ${data.projectType}</p>
            <p><strong>Módulos seleccionados:</strong> ${data.features.join(', ') || 'No especificado'}</p>
            <p><strong>Plazo:</strong> ${data.timeline}</p>
            <p><strong>Rango referencial:</strong> ${data.budgetRange}</p>
            <p><strong>Detalle del problema:</strong></p>
            <p>${data.problemSummary}</p>
          `,
        }),
        resend.emails.send({
          from: fromEmail,
          to: [data.email],
          subject: 'Recibimos tu solicitud de cotización — WSAICO',
          html: `
            <p>Hola ${data.fullName},</p>
            <p>Gracias por escribir a <strong>WSAICO (${SITE_CONFIG.legalName})</strong>.</p>
            <p>Ya recibí los detalles sobre tu proyecto de <strong>${data.projectType}</strong>. Revisaré tu requerimiento y me pondré en contacto contigo por correo o WhatsApp en menos de 24 horas hábiles.</p>
            <p>Si deseas adelantar algún detalle, puedes responder este correo o escribirme directamente al ${SITE_CONFIG.contact.phoneDisplay}.</p>
            <p>Atentamente,<br/><strong>Wilber Saico</strong><br/>Arquitecto de Software · wsaico.com</p>
          `,
        }),
      ]);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error en /api/cotizar:', err);
    return new Response(
      JSON.stringify({ ok: false, message: 'No se pudo procesar la solicitud en este momento.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
