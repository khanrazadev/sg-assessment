import { SendgridRaw, PostmanRaw, OpenAIRaw } from '@/types/blast-radius';

export const mockSendgrid: SendgridRaw = {
  "2fa_required": true,
  "key_type": "Full Access Key",
  "raw_scopes": ["2fa_required", "access_settings.activity.read", "access_settings.whitelist.create", "access_settings.whitelist.delete", "access_settings.whitelist.read", "access_settings.whitelist.update", "alerts.create", "alerts.delete", "alerts.read", "alerts.update", "api_keys.create", "api_keys.delete", "api_keys.read", "api_keys.update", "asm.groups.create", "asm.groups.delete", "asm.groups.read", "asm.groups.suppressions.create", "asm.groups.suppressions.delete", "asm.groups.suppressions.read", "asm.groups.suppressions.update", "asm.groups.update", "asm.suppressions.global.create", "asm.suppressions.global.delete", "asm.suppressions.global.read", "asm.suppressions.global.update", "browsers.stats.read", "categories.create", "categories.delete", "categories.read", "categories.stats.read", "categories.stats.sums.read", "categories.update", "clients.desktop.stats.read", "clients.phone.stats.read", "clients.stats.read", "clients.tablet.stats.read", "clients.webmail.stats.read", "credentials.create", "credentials.delete", "credentials.read", "credentials.update", "design_library.create", "design_library.delete", "design_library.read", "design_library.update", "devices.stats.read", "geo.stats.read", "ips.pools.ips.read", "mail.batch.create", "mail.batch.delete", "mail.batch.read", "mail.batch.update", "mail.send", "mail_settings.address_whitelist.create", "mail_settings.address_whitelist.delete", "mail_settings.address_whitelist.read", "mail_settings.address_whitelist.update", "mail_settings.bcc.create", "mail_settings.bcc.delete", "mail_settings.bcc.read", "mail_settings.bcc.update", "mail_settings.bounce_purge.create", "mail_settings.bounce_purge.delete", "mail_settings.bounce_purge.read", "mail_settings.bounce_purge.update", "mail_settings.footer.create", "mail_settings.footer.delete", "mail_settings.footer.read", "mail_settings.footer.update", "mail_settings.forward_bounce.create", "mail_settings.forward_bounce.delete", "mail_settings.forward_bounce.read", "mail_settings.forward_bounce.update", "mail_settings.forward_spam.create", "mail_settings.forward_spam.delete", "mail_settings.forward_spam.read", "mail_settings.forward_spam.update", "mail_settings.plain_content.create", "mail_settings.plain_content.delete", "mail_settings.plain_content.read", "mail_settings.plain_content.update", "mail_settings.read", "mail_settings.spam_check.create", "mail_settings.spam_check.delete", "mail_settings.spam_check.read", "mail_settings.spam_check.update", "mail_settings.template.create", "mail_settings.template.delete", "mail_settings.template.read", "mail_settings.template.update", "mailbox_providers.stats.read", "messages.read", "partner_settings.new_relic.create", "partner_settings.new_relic.delete", "partner_settings.new_relic.read", "partner_settings.new_relic.update", "partner_settings.read", "partner_settings.sendwithus.create", "partner_settings.sendwithus.delete", "partner_settings.sendwithus.read", "partner_settings.sendwithus.update", "recipients.erasejob.create", "recipients.erasejob.read", "sender_verification_eligible", "signup.trigger_confirmation", "stats.global.read", "stats.read", "subusers.stats.monthly.read", "subusers.stats.read", "subusers.stats.sums.read", "suppression.blocks.create", "suppression.blocks.delete", "suppression.blocks.read", "suppression.blocks.update", "suppression.bounces.create", "suppression.bounces.delete", "suppression.bounces.read", "suppression.bounces.update", "suppression.create", "suppression.delete", "suppression.invalid_emails.create", "suppression.invalid_emails.delete", "suppression.invalid_emails.read", "suppression.invalid_emails.update", "suppression.read", "suppression.spam_reports.create", "suppression.spam_reports.delete", "suppression.spam_reports.read", "suppression.spam_reports.update", "suppression.unsubscribes.create", "suppression.unsubscribes.delete", "suppression.unsubscribes.read", "suppression.unsubscribes.update", "suppression.update", "teammates.create", "teammates.delete", "teammates.read", "teammates.update", "templates.create", "templates.delete", "templates.read", "templates.update", "templates.versions.activate.create", "templates.versions.activate.delete", "templates.versions.activate.read", "templates.versions.activate.update", "templates.versions.create", "templates.versions.delete", "templates.versions.read", "templates.versions.update", "tracking_settings.click.create", "tracking_settings.click.delete", "tracking_settings.click.read", "tracking_settings.click.update", "tracking_settings.google_analytics.create", "tracking_settings.google_analytics.delete", "tracking_settings.google_analytics.read", "tracking_settings.google_analytics.update", "tracking_settings.open.create", "tracking_settings.open.delete", "tracking_settings.open.read", "tracking_settings.open.update", "tracking_settings.read", "tracking_settings.subscription.create", "tracking_settings.subscription.delete", "tracking_settings.subscription.read", "tracking_settings.subscription.update", "ui.confirm_email", "ui.provision", "ui.signup_complete", "user.account.read", "user.credits.read", "user.email.read", "user.profile.create", "user.profile.delete", "user.profile.read", "user.profile.update", "user.scheduled_sends.create", "user.scheduled_sends.delete", "user.scheduled_sends.read", "user.scheduled_sends.update", "user.settings.enforced_tls.read", "user.settings.enforced_tls.update", "user.timezone.create", "user.timezone.delete", "user.timezone.read", "user.timezone.update", "user.username.read", "user.webhooks.event.settings.create", "user.webhooks.event.settings.delete", "user.webhooks.event.settings.read", "user.webhooks.event.settings.update", "user.webhooks.event.test.create", "user.webhooks.event.test.delete", "user.webhooks.event.test.read", "user.webhooks.event.test.update", "user.webhooks.parse.settings.create", "user.webhooks.parse.settings.delete", "user.webhooks.parse.settings.read", "user.webhooks.parse.settings.update", "user.webhooks.parse.stats.read", "whitelabel.create", "whitelabel.delete", "whitelabel.read", "whitelabel.update"],
  "scopes": [
    { "access": "Read & Write", "permissions": ["api_keys.create", "api_keys.delete", "api_keys.read", "api_keys.update"], "scope": "API Keys", "sub_scope": "" },
    { "access": "Read & Write", "permissions": ["alerts.create", "alerts.delete", "alerts.read", "alerts.update"], "scope": "Alerts", "sub_scope": "" },
    { "access": "Read & Write", "permissions": ["mail.send"], "scope": "Mail Send", "sub_scope": "Mail Send" },
    { "access": "Read & Write", "permissions": ["teammates.create", "teammates.delete", "teammates.read", "teammates.update"], "scope": "Teammates", "sub_scope": "" },
  ],
  "total_raw_scopes": 206,
  "total_scopes": 42,
  "valid_key": true
};

export const mockPostman: PostmanRaw = {
  "reference": "https://learning.postman.com/docs/collaborating-in-postman/roles-and-permissions/#team-roles",
  "roles": [{ "permissions": "Has access to all team resources and workspaces.", "scope": "user" }],
  "team_info": { "domain": "https://.postman.co", "name": "cyberkartik team" },
  "total_roles": 1,
  "total_workspaces": 1,
  "user_info": { "email": "cyberkartik+1@gmail.com", "full_name": "Kartik", "roles": ["user"], "team_domain": "", "team_name": "", "username": "cyberkartik" },
  "valid_key": true,
  "workspaces": [{ "id": "ddb30ec5-8039-4a1a-8a26-8f8600b74002", "link": "https://go.postman.co/workspaces/ddb30ec5", "name": "My Workspace", "type": "personal", "visibility": "personal" }]
};

export const mockOpenAI: OpenAIRaw = {
  "is_admin": false,
  "is_restricted": true,
  "key_type": "Service Account API Key",
  "organizations": [{ "default": true, "description": "", "id": "org-41km", "personal": false, "role": "reader", "title": "Mesh.ai", "user": "mesh-4" }],
  "permissions": "Restricted API Key. Limited permissions available.",
  "scopes": [
    { "endpoints": ["/v1/models"], "permission": "Read", "scope": "/v1/models" },
    { "endpoints": ["/v1/audio", "/v1/chat/completions", "/v1/embeddings", "/v1/images", "/v1/moderations"], "permission": "Write", "scope": "/v1/audio" },
    { "endpoints": ["/v1/assistants"], "permission": "Read & Write", "scope": "/v1/assistants" },
    { "endpoints": ["/v1/threads"], "permission": "Read & Write", "scope": "/v1/threads" }
  ],
  "total_organizations": 1,
  "total_scopes": 8,
  "user_info": null,
  "user_info_available": false,
  "valid_token": true
};
