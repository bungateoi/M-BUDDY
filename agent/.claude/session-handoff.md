# Handoff — AI agent backend cho M-BUDDY

## Việc cần làm khi session mới mở lên (sau `claude --continue`)
Gọi skill agentbase-wizard để lên scope (Spec Kit) trước khi code:

> Build an AI agent backend for M-BUDDY (React Native sales training app for
> MSB bank employees), deployed on GreenNode AgentBase, using Qwen 3.6 Flash
> from GreenNode AI Platform.
>
> 2 functions:
> 1. Role-play: input = persona + product + conversation history + new
>    sales-rep utterance → output = structured JSON with the virtual
>    customer's reply (not free text)
> 2. Scoring: input = full call transcript → output = scores per 6-criteria
>    rubric (customer_understanding, knowledge, communication,
>    objection_handling, insight_discovery, closing) + strengths +
>    improvements + next_level_suggestion
>
> Reference material already in the mobile app repo:
> - /Users/mac/Desktop/M-BUDDY/docs/ai-prompts.md (draft prompts for both
>   functions)
> - /Users/mac/Desktop/M-BUDDY/docs/sales-skill-scoring-rubric.md (6-criteria
>   rubric, full definitions)
> - /Users/mac/Desktop/M-BUDDY/docs/products.md, personas.md,
>   roleplay-scenarios.md (domain data: 5 products, 5 personas, 25 levels)
> - /Users/mac/Desktop/M-BUDDY/app/data/types.ts (TS types the mobile app
>   already expects: Persona, Product, Level, QuizQuestion, RoleplayResult
>   etc — the backend's JSON contracts should line up with these)
> - /Users/mac/Desktop/M-BUDDY/app/lib/ai.ts (client-side stub already
>   defines the exact function signatures + RoleplayAIParams/ScoringAIParams/
>   ScoringResult shapes the mobile app expects to call — treat this as the
>   binding contract for the backend's API shape)
>
> Do the scope/spec step first (clear input/output for both functions), no
> code yet.

Backend project root = /Users/mac/Desktop/M-BUDDY/agent/ (this folder).
