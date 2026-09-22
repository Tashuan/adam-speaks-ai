# Adam agent skills

The canonical skill is:

```text
skills/adam-integration/SKILL.md
```

Platform discovery copies are provided for common agent environments:

```text
.agents/skills/adam-integration/SKILL.md
.cursor/skills/adam-integration/SKILL.md
.devin/skills/adam-integration/SKILL.md
```

If an agent supports the open Agent Skills convention, use `skills/adam-integration/SKILL.md`. If it discovers platform-specific directories, use the matching wrapper above; each wrapper points to the same canonical instructions.

The skill covers:

- Choosing a website, application, agent, MCP, or CLI integration path
- The Adam MCP endpoint and tool catalog
- Installing and using the public CLI
- Provisioning and embedding
- Browser, REST, WebSocket, and MCP control
- Security rules and failure handling
