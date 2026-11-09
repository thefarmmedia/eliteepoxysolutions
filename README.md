# Elite Epoxy Solutions website

Responsive static multipage website for Elite Epoxy Solutions, LLC.

## Service offering
- Flake epoxy
- Solid color epoxy
- Metallic epoxy
- Grind / seal
- Concrete grinding / prep
- Stone Wrap coatings
- Polished concrete

## Pricing calculator
Flake epoxy only, $6–$8 per sq ft. No visualizer.

## Assets
104 original project JPGs and Elite logo are included in the repository.

## Deployment
Netlify-compatible root directory, no build command, publish directory ".". Netlify Forms lead forms require enabling Forms/notifications and an end-to-end submission check. A GitHub merge does not automatically configure domain, DNS, or hosting.

Calculator quote requests are stored in Netlify Forms. The submission-created function forwards the two calculator forms to LeadConnector when CALCULATOR_LEAD_WEBHOOK_URL is set in the Netlify site's Functions environment. Deploy after setting the variable, then verify a test quote reaches both Netlify Forms and the LeadConnector workflow.
