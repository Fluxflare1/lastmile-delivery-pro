lastmile-delivery-pro/
├── backend/
│   ├── Dockerfile
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/                 # Django project settings (settings.py, urls.py, wsgi.py)
│   ├── apps/
│   │   ├── accounts/           # Auth, roles, user management (multi-tenant middleware)
│   │   ├── clients/            # Direct B2B clients using the service
│   │   ├── partners/           # Motor parks, logistics companies
│   │   ├── couriers/           # Delivery personnel management, KPIs
│   │   ├── orders/             # Order lifecycle: register → validate → deliver
│   │   ├── billing/            # Payment, invoices, reconciliation
│   │   ├── notifications/      # SMS/Email via Twilio/SendGrid
│   │   ├── analytics/          # Reports and insights
│   │   ├── hr/                 # Internal staff module (KPI, payroll)
│   │   └── core/               # Common utils, mixins, RLS, middleware
│   └── tests/
│       └── ...                 # Unit/integration tests
│
├── frontend/
│   ├── Dockerfile
│   ├── next.config.js
│   ├── package.json
│   ├── src/
│   │   ├── app/                # Next.js app router entry
│   │   ├── components/         # Shared UI components (Tailwind + shadcn)
│   │   ├── pages/              # Marketing/public pages
│   │   ├── features/
│   │   │   ├── admin-panel/             # Platform Admin UI
│   │   │   ├── service-provider-portal/ # Partner (motor park/logistics) portal
│   │   │   ├── client-portal/           # Corporate client portal
│   │   │   ├── courier-app/             # Courier PWA (mobile-first)
│   │   │   └── customer-app/            # Customer tracking/booking app
│   │   └── styles/
│   └── public/                # Assets (icons, logos, images)
│
├── docker-compose.yml
├── README.md
└── docs/
    ├── API_SPEC.md
    ├── ARCHITECTURE.md
    └── DEPLOYMENT_GUIDE.md
