# Claim and activation

During the hosted registration flow, Adam gives the agent a short-lived Google authorization URL. The user follows it and signs in once; no password or manual dashboard setup is required.

The hosted completion binds the registration to the authenticated Firebase user and provisions the workspace as claimed. For legacy provisional claims, the claim completion path updates the workspace, avatar, installation, and entitlement ownership together. `workspaceId`, `avatarId`, and `installationId` do not change.

After sign-in, the avatar appears in the authenticated Adam dashboard. The user can update its identity, personality, voice, and allowed origins without changing the installation embed. Provisional installations use canned mock speech; entitlements are recomputed after claim and can later enable live speech.
