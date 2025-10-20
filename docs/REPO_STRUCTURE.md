lastmile-delivery-pro/
├── 📁 backend/
│   ├── 📁 services/
│   │   ├── 📁 identity-service/          # Authentication & Authorization
│   │   │   ├── src/
│   │   │   │   ├── app/
│   │   │   │   │   ├── models/
│   │   │   │   │   ├── views/
│   │   │   │   │   ├── serializers/
│   │   │   │   │   └── middleware/
│   │   │   │   ├── config/
│   │   │   │   └── manage.py
│   │   │   ├── requirements.txt
│   │   │   └── Dockerfile
│   │   ├── 📁 tenant-management/         # LMDSP & DCSD Tenant Management
│   │   ├── 📁 lmdsp-order-service/       # LMDSP Order Processing
│   │   ├── 📁 dcsd-service/              # DCSD B2B Platform
│   │   │   ├── src/
│   │   │   │   ├── project_intents/
│   │   │   │   ├── job_cards/
│   │   │   │   ├── client_management/
│   │   │   │   ├── partner_management/
│   │   │   │   ├── execution/
│   │   │   │   └── analytics/
│   │   │   └── requirements.txt
│   │   ├── 📁 shipping-service/          # Shared Shipping Management
│   │   ├── 📁 dispatch-service/          # Courier Dispatch & Routing
│   │   ├── 📁 tracking-service/          # Real-time Tracking
│   │   ├── 📁 payment-service/           # Billing & Payments
│   │   ├── 📁 notification-service/      # Notifications
│   │   ├── 📁 analytics-service/         # Analytics & Reporting
│   │   └── 📁 support-service/           # Customer Support
│   ├── 📁 api-gateway/                   # Django + NGINX
│   ├── 📁 shared/
│   │   ├── 📁 common/                    # Shared Django apps
│   │   ├── 📁 utils/                     # Utility functions
│   │   └── 📁 libs/                      # Shared libraries
│   └── 📁 database/
│       ├── 📁 migrations/
│       ├── 📁 seeds/
│       └── 📁 models/
├── 📁 frontend/
│   ├── 📁 marketing-site/                # Landing Page & Marketing Website
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── styles/
│   │   │   └── utils/
│   │   ├── package.json
│   │   ├── next.config.js
│   │   └── tailwind.config.js
│   ├── 📁 customer-app/                  # React Native - LMDSP B2C App
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── screens/
│   │   │   ├── navigation/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   ├── package.json
│   │   └── metro.config.js
│   ├── 📁 client-portal/                 # Next.js - DCSD B2B Client Portal
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── project-intents/
│   │   │   │   ├── job-cards/
│   │   │   │   ├── analytics/
│   │   │   │   └── settings/
│   │   │   ├── components/
│   │   │   │   ├── ui/                   # shadcn/ui components
│   │   │   │   ├── forms/
│   │   │   │   └── charts/
│   │   │   ├── lib/
│   │   │   └── types/
│   │   ├── package.json
│   │   ├── next.config.js
│   │   └── tailwind.config.js
│   ├── 📁 courier-app/                   # React Native - Unified Courier App
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── screens/
│   │   │   │   ├── auth/
│   │   │   │   ├── tasks/
│   │   │   │   ├── tracking/
│   │   │   │   └── earnings/
│   │   │   ├── navigation/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   └── package.json
│   ├── 📁 lmdsp-admin/                   # Next.js - LMDSP Admin Portal
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── courier-management/
│   │   │   │   ├── order-management/
│   │   │   │   ├── analytics/
│   │   │   │   └── settings/
│   │   │   └── components/
│   │   └── package.json
│   ├── 📁 dcsd-admin/                    # Next.js - DCSD Internal Admin
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── client-management/
│   │   │   │   ├── partner-management/
│   │   │   │   ├── project-intents/
│   │   │   │   ├── job-cards/
│   │   │   │   └── analytics/
│   │   │   └── components/
│   │   └── package.json
│   └── 📁 platform-admin/                # Next.js - Super Admin Portal
├── 📁 mobile/
│   ├── 📁 shared/                        # Shared React Native Components
│   │   ├── components/
│   │   ├── navigation/
│   │   ├── services/
│   │   └── utils/
│   ├── 📁 customer-app/
│   ├── 📁 courier-app/
│   └── 📁 driver-app/
├── 📁 infrastructure/
│   ├── 📁 docker/
│   │   ├── docker-compose.yml
│   │   ├── Dockerfile.django
│   │   ├── Dockerfile.nextjs
│   │   ├── Dockerfile.react-native
│   │   └── nginx/
│   │       ├── nginx.conf
│   │       ├── ssl/
│   │       └── sites-available/
│   ├── 📁 kubernetes/
│   │   ├── deployments/
│   │   ├── services/
│   │   ├── configmaps/
│   │   └── secrets/
│   ├── 📁 terraform/
│   │   ├── modules/
│   │   ├── environments/
│   │   │   ├── dev/
│   │   │   ├── staging/
│   │   │   └── prod/
│   │   └── variables.tf
│   └── 📁 scripts/
│       ├── deploy.sh
│       ├── ssl-setup.sh
│       └── backup.sh
├── 📁 docs/
│   ├── 📁 architecture/
│   ├── 📁 api/
│   ├── 📁 deployment/
│   └── 📁 user-guides/
├── 📁 testing/
│   ├── 📁 unit-tests/
│   ├── 📁 integration-tests/
│   ├── 📁 e2e-tests/
│   └── 📁 performance-tests/
├── 📁 ci-cd/
│   ├── .github/workflows/
│   ├── Jenkinsfile
│   └── config.yml
├── 📁 monitoring/
│   ├── prometheus/
│   ├── grafana/
│   ├── alerts/
│   └── logs/
├── requirements.txt
├── package.json
├── README.md
├── .env.example
└── .gitignore
