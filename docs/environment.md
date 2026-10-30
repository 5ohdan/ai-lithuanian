# Environment configuration

Keep runtime secrets, public build settings, and administrative credentials separate.

| Purpose                     | Local development                                            | Production / CI                             |
| --------------------------- | ------------------------------------------------------------ | ------------------------------------------- |
| Auth and Gemini secrets     | `.dev.vars` from `.dev.vars.example`                         | Encrypted Worker secrets                    |
| Public PostHog settings     | `.env.development` / `.env.production` from `.env.example`   | GitHub repository variables                 |
| Cloudflare deployment token | Administrative shell or protected credential file, if needed | GitHub Actions secret, deployment step only |

## Runtime secrets

`wrangler.jsonc` declares the six required secret names. Values must never appear
in the config or source. Wrangler loads only those names into the local Worker;
`.dev.vars` takes precedence over `.env` for runtime bindings. Auth and AI settings
are validated separately when used. All six secrets remain required for deployment.

Use separate development OAuth applications and AI credentials where practical.
Set local OAuth callbacks for Google and GitHub to
`http://localhost:5173/api/auth/callback/google` and
`http://localhost:5173/api/auth/callback/github`, respectively.

After changing bindings or secret names, run `pnpm cf-typegen` and commit the
generated types. Required secret names make type generation independent of a
contributor’s private local files.

Production secrets are managed through Cloudflare, not copied from local files by
CI. `wrangler secret put` and `wrangler secret delete` immediately deploy a new
version. Use the `wrangler versions secret` workflow when a staged change is needed.
Do not rotate the authentication secret casually: it can invalidate sessions.

## Public build settings

`NEXT_PUBLIC_POSTHOG_KEY` must be the public project token, never a personal API
key. Set it with `NEXT_PUBLIC_POSTHOG_HOST`, or omit both to disable analytics.
Blank settings are treated as absent. These values are embedded in browser code;
changing Worker runtime bindings does not update them. Rebuild and deploy instead.

GitHub Actions reads them from repository **variables**, not secrets. Forks without
these variables can build with analytics disabled.

## Administrative credentials

`CLOUDFLARE_API_TOKEN` is not an application secret and must not be bound to the
Worker or placed in app environment files. Keep the account-scoped deployment
token in GitHub Actions secrets and expose it only to the deployment step.
`CLOUDFLARE_ACCOUNT_ID` is deployment configuration, not a sensitive value; the
existing workflow keeps it in GitHub secrets alongside the token.

Remote Drizzle tooling may require `CLOUDFLARE_ACCOUNT_ID`, `DATABASE_ID`, and a
token with suitable D1 permissions in its administrative shell. The Worker uses
its `DB` binding instead. Do not run production `db:push`; follow the
[database release procedure](database.md).

Local administrative credentials, if retained, belong in an ignored, access-restricted
file such as `.credentials/cloudflare.env` (mode `600`). It is not loaded by the app.
Do not print, commit, or copy these credentials into browser build settings.

See [Cloudflare secrets](https://developers.cloudflare.com/workers/configuration/secrets/).
