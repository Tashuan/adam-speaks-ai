# Claim and activation

After provisioning, Adam sends an ownership/sign-in link to the email supplied by the user. The email can be resent within abuse limits if it is lost in the agent conversation.

The user completes Adam sign-in/OAuth from the link. Claiming attaches the provisional workspace and every avatar/installation in that workspace to the authenticated user. `avatarId` and `installationId` do not change.

The provisional installation uses canned mock speech. Entitlements are recomputed after claim and can later enable live speech without changing the website embed code.
