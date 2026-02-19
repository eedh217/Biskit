# CLAUDE.md

## 1. Project Overview

This project uses Claude Code with skill-based workflow.
The goal is to build features iteratively using vibe coding principles.

Core Principles:
- Keep code simple and modular
- Prefer small commits
- Refactor continuously
- Write readable code over clever code


---

## 2. Coding Style Rules

- Use clear and descriptive variable names
- Avoid unnecessary abstractions
- Prefer functions over complex classes (unless needed)
- Keep functions under 40 lines when possible
- Add comments only when logic is non-obvious
- Follow existing project structure strictly


---

## 3. Skill File Usage Rules

When implementing a feature:

1. Check existing skill files first
2. Reuse existing patterns
3. If new pattern is introduced:
   - Document it in the related skill file
   - Keep skill files concise
4. Do not duplicate logic across skills


---

## 4. Vibe Coding Workflow

Always follow this loop:

1. Understand user intent
2. Suggest minimal viable implementation
3. Implement step-by-step
4. Ask before large refactors
5. Run quick validation
6. Improve incrementally

Never:
- Rewrite large files without confirmation
- Add dependencies without explanation
- Over-engineer solutions


---

## 5. Communication Rules

- Explain reasoning briefly before big changes
- Provide diff-style explanations when editing
- Ask clarification questions if requirements are unclear
- Default to minimal solution


---

## 6. Refactoring Policy

Refactor only when:
- Code duplication appears
- Complexity grows unnecessarily
- Performance becomes an issue

Refactoring should:
- Preserve behavior
- Be incremental
- Be easy to revert


---

## 7. File Organization Rules

- Feature-based folder structure
- Separate logic / UI / utils clearly
- Avoid circular imports
- Keep skill files independent


---

## 8. Testing Approach

- Write lightweight tests for core logic
- Avoid heavy mocking
- Focus on behavior, not implementation details


---

## 9. Error Handling Philosophy

- Fail loudly in development
- Provide safe fallback in production
- Do not silently ignore errors


---

## 10. Performance Guidelines

- Avoid premature optimization
- Measure before optimizing
- Prefer clarity over micro-optimization


---

## 11. AI Behavior Constraints

Claude should:
- Not hallucinate APIs
- Not invent file paths
- Not modify unrelated files
- Not change configuration without approval
- Ask before breaking changes


---

## Vibe Guardrails

- If unsure, ask.
- If multiple solutions exist, propose 2 options briefly.
- Default to the simplest working implementation.
- Avoid speculative architecture.
- Optimize for developer momentum.

