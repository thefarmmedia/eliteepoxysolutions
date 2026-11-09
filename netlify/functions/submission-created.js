const calculatorForms = new Set(['calculator-lead', 'calculator-home-lead']);

exports.handler = async function (event) {
  const { payload } = JSON.parse(event.body);
  if (!calculatorForms.has(payload?.form_name)) {
    return { statusCode: 204 };
  }

  const webhook = process.env.CALCULATOR_LEAD_WEBHOOK_URL;
  if (!webhook) {
    console.error('Calculator lead webhook is not configured.');
    return { statusCode: 503, body: 'Webhook unavailable' };
  }

  const data = payload.data || {};
  const lead = {
    name: data.name,
    phone: data.phone,
    email: data.email,
    city: data.city,
    service: data.service,
    message: data.message,
    square_feet: data.square_feet,
    concrete_condition: data.concrete_condition,
    project_size: data.project_size,
    planning_range: data.planning_range,
    source: payload.form_name === 'calculator-home-lead' ? 'Homepage calculator' : 'Pricing calculator',
    submission_id: payload.id
  };

  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000)
    });
    if (response.ok) return { statusCode: 204 };
    console.error('Calculator lead webhook returned HTTP %d.', response.status);
  } catch {
    console.error('Calculator lead webhook could not be reached.');
  }
  return { statusCode: 502, body: 'Webhook delivery failed' };
};
