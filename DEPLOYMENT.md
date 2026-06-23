# Test deployment: Rouling Car

## 1. Create the database

1. Create a free project at https://supabase.com/dashboard.
2. In **SQL Editor**, run [`supabase/schema.sql`](./supabase/schema.sql).
3. In **Authentication > Providers**, leave Email enabled and disable public sign-ups after creating the agency account.
4. In **Authentication > Users**, invite the agency owner's email address. They will set a secure password.
5. In **Project Settings > API**, copy the Project URL and the anonymous public key.

## 2. Connect the project

1. Copy `.env.example` to `.env.local`.
2. Paste the Supabase URL and anonymous key.
3. Add the same values to Vercel under **Project > Settings > Environment Variables** for Preview and Production.

## 3. Create a private Vercel test link

1. Put this project in a new private GitHub repository.
2. At https://vercel.com/new, import that repository.
3. Use the project root `rolling-cars-morocco` and build command `npm run build`.
4. Deploy. Vercel gives a private `*.vercel.app` test link; share that link with the client.
5. Each GitHub update creates a new Preview deployment before anything goes live.

## Before sharing

- Test each vehicle card and WhatsApp reservation message.
- Log in to `/admin/login` and add/edit a test car with an image.
- Check mobile layout and both phone numbers.
- Do not connect a custom domain until the client approves the Preview link.

## Important

The current UI uses browser-local demo storage. The SQL schema above is production-ready, but the final Supabase connection must be enabled in the application before data is shared between devices. Do not give anyone the Supabase service-role key.
