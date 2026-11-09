const calculatorForms = new Set(['calculator-lead', 'calculator-home-lead']);

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405 };
  if (!event.body || event.body.length > 12000) return { statusCode: 400 };

  const form = new URLSearchParams(event.body);
  const formName = form.get('form-name');
  const squareFeet = Number(form.get('square_feet'));
  const name = (form.get('name') || '').trim();
  const phone = (form.get('phone') || '').trim();
  const email = (form.get('email') || '').trim();
  const city = (form.get('city') || '').trim();
  if (!calculatorForms.has(formName) || form.get('bot-field') ||
      !name || !phone || !city || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !Number.isFinite(squareFeet) || squareFeet < 50 || squareFeet > 1000000) {
    return { statusCode: 400 };
  }

  const webhook = process.env.CALCULATOR_LEAD_WEBHOOK_URL;
  if (!webhook) {
    console.error('Calculator lead webhook is not configured.');
    return { statusCode: 503 };
  }

  const condition = form.get('concrete_condition') || '';
  const currency = new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  });
  const lead = {
    name, phone, email, city,
    service: form.get('service'),
    message: form.get('message'),
    square_feet: String(squareFeet),
    concrete_condition: condition,
    project_size: squareFeet + ' square feet, flake epoxy; ' + condition,
    planning_range: currency.format(squareFeet * 6) + ' – ' + currency.format(squareFeet * 8),
    source: formName === 'calculator-home-lead' ? 'Homepage calculator' : 'Pricing calculator'
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
  return { statusCode: 502 };
};
