# AI Prompts Documentation

This document describes all AI prompts used in the Interview Prep application. The application uses the `@cf/meta/llama-3.3-70b-instruct-fp8-fast` model via Cloudflare Workers AI.

## Overview

The application uses two main AI roles:
1. **Interviewer** - Conducts the interview and asks questions
2. **Evaluator** - Evaluates candidate responses and provides scores

---

## Interviewer System Prompt

### Purpose
The interviewer AI simulates a technical interviewer at a top tech company. It asks relevant questions, provides follow-ups, and adapts to the candidate's skill level.

### Template

```
You are an experienced technical interviewer conducting a {difficulty} level interview for a {role} position at a top tech company.

Your responsibilities:
1. Ask relevant, challenging interview questions appropriate for the {role} role
2. Follow up on answers with probing questions
3. Provide hints if the candidate is stuck (but not the answer)
4. Keep the conversation professional and encouraging
5. Ask one question at a time
6. Adapt difficulty based on candidate responses

For {role} interviews, focus on:
{role-specific focus areas}

Start by introducing yourself briefly and asking your first question. Keep responses concise and focused.
```

### Role-Specific Focus Areas

#### Software Engineer
```
- Data structures and algorithms
- Code optimization and complexity analysis
- System design basics
- Problem-solving methodology
```

#### Product Manager
```
- Product strategy and vision
- User research and metrics
- Prioritization frameworks
- Cross-functional collaboration
```

#### Data Scientist
```
- Statistical analysis and ML concepts
- Data manipulation and visualization
- Model selection and evaluation
- Business impact of data insights
```

#### Frontend Developer
```
- HTML, CSS, JavaScript fundamentals
- React/Vue/Angular frameworks
- Performance optimization
- Accessibility and UX principles
```

#### Backend Developer
```
- API design and RESTful principles
- Database design and optimization
- Scalability and performance
- Security best practices
```

#### DevOps Engineer
```
- CI/CD pipelines
- Infrastructure as Code
- Monitoring and observability
- Cloud platforms (AWS, GCP, Azure)
```

#### System Design
```
- Scalability and distributed systems
- Database choices and trade-offs
- Caching strategies
- Load balancing and fault tolerance
```

#### Behavioral
```
- Leadership and teamwork examples
- Conflict resolution
- Project management experience
- Growth mindset and learning
```

### Usage
The interviewer prompt is used:
1. At session start to generate the opening question
2. After each user response to generate follow-up questions

---

## Evaluator System Prompt

### Purpose
The evaluator AI assesses candidate responses objectively and provides structured feedback with scores.

### Template

```
You are an expert interview evaluator assessing a candidate's response for a {role} position.

Evaluate the response based on:
1. Technical accuracy (if applicable)
2. Communication clarity
3. Problem-solving approach
4. Depth of knowledge
5. Relevance to the question

Provide your evaluation in the following JSON format only (no other text):
{
  "score": <number 1-10>,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "feedback": "<brief constructive feedback>"
}

Be fair but rigorous. A score of 7+ indicates a strong answer, 5-6 is acceptable, below 5 needs improvement.
```

### Input Format
The evaluator receives context in this format:
```
Question asked: "{last AI question}"

Candidate's response: "{user's answer}"
```

### Output Format
The evaluator returns JSON:
```json
{
  "score": 7,
  "strengths": ["Clear explanation", "Good use of examples"],
  "improvements": ["Could discuss edge cases", "Add complexity analysis"],
  "feedback": "Solid response demonstrating understanding of core concepts."
}
```

### Scoring Guidelines
- **8-10**: Excellent answer, comprehensive and accurate
- **7**: Good answer with minor gaps
- **5-6**: Acceptable answer but missing key elements
- **3-4**: Weak answer with significant gaps
- **1-2**: Poor answer, fundamental misunderstanding

---

## Final Feedback Prompt

### Purpose
Generates comprehensive end-of-session feedback summarizing the candidate's overall performance.

### Template

```
You are an interview coach providing final feedback. Summarize the candidate's performance in 2-3 paragraphs. Be constructive and specific. Mention key strengths and areas for improvement.
```

### Input Format
```
Here's the interview transcript:

{full conversation transcript}

Provide final feedback for this candidate.
```

---

## Prompt Design Principles

### 1. Role Clarity
Each prompt clearly defines the AI's role and responsibilities to ensure consistent behavior.

### 2. Structured Output
The evaluator prompt requires JSON output for reliable parsing and display.

### 3. Adaptability
The interviewer is instructed to adapt difficulty based on responses, creating a natural interview flow.

### 4. Constructive Feedback
All prompts emphasize constructive, encouraging feedback while maintaining rigor.

### 5. Conciseness
Prompts instruct the AI to keep responses focused and concise for better user experience.

---

## Model Configuration

### Model Used
`@cf/meta/llama-3.3-70b-instruct-fp8-fast`

### Parameters
- **max_tokens**:
  - Interviewer: 500-600 tokens (concise questions)
  - Evaluator: 300 tokens (structured feedback)
  - Final feedback: 400 tokens (summary)

### Why This Model?
- Fast inference for real-time chat experience
- Strong instruction following for structured outputs
- Good balance of capability and speed
- Native support in Cloudflare Workers AI

---

---

## Question Banks

Each interview type includes a curated question bank of **50 questions** (400 total). The AI interviewer randomly selects 15 questions per session to ensure variety. Questions are categorized by topic within each role.

### Software Engineer Questions (50)

**Data Structures & Algorithms**
1. Explain the difference between a stack and a queue. When would you use each?
2. How would you find the middle element of a linked list in one pass?
3. Explain time and space complexity. What is Big O notation?
4. How would you detect a cycle in a linked list?
5. Explain the difference between BFS and DFS. When would you use each?
6. How would you reverse a linked list?
7. What is a hash table and how does it handle collisions?
8. Explain dynamic programming with an example.
9. How would you design a LRU cache?
10. How would you implement a binary search tree?
11. Explain the difference between arrays and linked lists.
12. What is recursion and when should you use it?
13. How would you find the kth largest element in an array?
14. Explain merge sort and its time complexity.
15. What is a heap data structure and when would you use it?
16. How would you detect duplicates in an array?
17. Explain the concept of memoization.
18. What is a graph and how would you represent it in code?
19. How would you find the shortest path in an unweighted graph?
20. Explain the difference between a tree and a graph.
21. What is a balanced binary tree?
22. How would you serialize and deserialize a binary tree?
23. Explain quicksort and its average/worst case complexity.
24. What is a trie and when would you use it?
25. How would you implement a queue using two stacks?
26. Explain the sliding window technique with an example.
27. What is the two-pointer technique?
28. How would you find all permutations of a string?

**System Concepts**
29. What is the difference between a process and a thread?
30. Explain how garbage collection works.
31. What are the SOLID principles? Explain each one.
32. Explain the difference between concurrency and parallelism.
33. What is deadlock and how can you prevent it?
34. How would you implement a thread-safe singleton?
35. Explain memory management in your preferred language.
36. What is the difference between stack and heap memory?
37. How would you optimize a slow-running algorithm?
38. Explain the concept of amortized time complexity.
39. What is a bloom filter and when would you use it?
40. How would you implement an LFU cache?
41. Explain consistent hashing.

**Networking & Protocols**
42. What is the difference between TCP and UDP?
43. How does HTTP/2 differ from HTTP/1.1?
44. Explain REST vs GraphQL.
45. What is WebSocket and when would you use it?
46. How would you handle race conditions?
47. Explain the producer-consumer problem.
48. What is a semaphore vs a mutex?
49. How would you design a thread pool?
50. Explain the CAP theorem and its implications.

### Product Manager Questions (50)

**Product Strategy**
1. How would you prioritize features for a new product launch?
2. Tell me about a product you admire and why.
3. How would you measure the success of a new feature?
4. Walk me through how you would conduct user research.
5. How do you handle disagreements with engineering about priorities?
6. Describe your approach to writing a PRD.
7. How would you decide whether to build vs buy a solution?
8. Tell me about a time you had to pivot a product strategy.
9. How do you balance user needs with business goals?
10. How would you improve our competitor's product?
11. Describe your approach to roadmap planning.
12. How do you gather and incorporate customer feedback?
13. What metrics would you track for a subscription product?
14. How would you launch a product in a new market?
15. Describe your experience with A/B testing.

**Stakeholder Management**
16. How do you communicate product decisions to stakeholders?
17. What's your process for defining product requirements?
18. How would you handle a feature that's not performing well?
19. Describe how you work with design teams.
20. How do you stay informed about market trends?
21. What's your approach to competitive analysis?
22. How would you price a new product?
23. Describe your experience with agile methodologies.
24. How do you handle technical debt discussions?
25. What's your approach to MVP definition?

**Growth & Metrics**
26. How would you increase user engagement?
27. Describe a time you had to say no to a stakeholder.
28. How do you measure product-market fit?
29. What's your approach to user segmentation?
30. How would you reduce customer churn?
31. Describe your experience with go-to-market strategies.
32. How do you align product goals with company OKRs?
33. What's your approach to feature deprecation?
34. How would you handle a product crisis?
35. Describe your experience with data-driven decisions.

**Execution**
36. How do you prioritize bug fixes vs new features?
37. What's your approach to internationalization?
38. How would you improve user onboarding?
39. Describe your experience with platform products.
40. How do you handle conflicting user feedback?
41. What's your approach to product documentation?
42. How would you build a product community?
43. Describe your experience with B2B vs B2C products.
44. How do you measure customer satisfaction?
45. What's your approach to product analytics?
46. How would you handle scope creep?
47. Describe your experience with product launches.
48. How do you build relationships with engineering?
49. What's your approach to risk assessment?
50. How would you validate a new product idea?

### Data Scientist Questions (50)

**Machine Learning Fundamentals**
1. Explain the bias-variance tradeoff.
2. How would you handle missing data in a dataset?
3. What is the difference between supervised and unsupervised learning?
4. Explain cross-validation and why it's important.
5. How would you detect and handle outliers?
6. What metrics would you use for an imbalanced classification problem?
7. Explain the difference between L1 and L2 regularization.
8. How would you explain a complex model to a non-technical stakeholder?
9. What is feature engineering and why is it important?
10. How would you A/B test a new recommendation algorithm?
11. Explain the difference between precision and recall.
12. What is overfitting and how do you prevent it?
13. Explain gradient descent and its variants.
14. What is the curse of dimensionality?
15. How would you handle categorical variables?

**Advanced ML**
16. Explain the difference between bagging and boosting.
17. What is a confusion matrix?
18. How would you select features for a model?
19. Explain ROC curves and AUC.
20. What is the difference between generative and discriminative models?
21. How would you handle time series data?
22. Explain the concept of ensemble learning.
23. What is transfer learning?
24. How would you deploy a machine learning model?
25. Explain the difference between batch and online learning.
26. What is dropout and why is it used?
27. How would you handle multi-collinearity?
28. Explain the K-means clustering algorithm.
29. What is PCA and when would you use it?
30. How would you evaluate a clustering model?

**Deep Learning & NLP**
31. Explain neural network backpropagation.
32. What is a convolutional neural network?
33. How would you handle text data for NLP?
34. Explain word embeddings like Word2Vec.
35. What is attention mechanism in deep learning?
36. How would you build a recommendation system?
37. Explain collaborative vs content-based filtering.
38. What is the cold start problem?
39. How would you detect anomalies in data?

**Statistics & Experimentation**
40. Explain hypothesis testing.
41. What is p-value and statistical significance?
42. How would you design an experiment?
43. Explain Bayesian vs frequentist approaches.
44. What is survival analysis?
45. How would you handle seasonality in forecasting?
46. Explain ARIMA models.
47. What is causal inference?

**MLOps & Ethics**
48. How would you measure model drift?
49. Explain MLOps and model monitoring.
50. What ethical considerations exist in ML?

### Frontend Developer Questions (50)

**JavaScript Fundamentals**
1. Explain the difference between == and === in JavaScript.
2. What is the event loop in JavaScript?
3. Explain the concept of closures in JavaScript.
4. Explain event delegation in JavaScript.
5. Explain the difference between let, const, and var.
6. What is hoisting in JavaScript?
7. How do promises work in JavaScript?
8. Explain async/await syntax.
9. What is the difference between null and undefined?
10. How would you debounce or throttle a function?
11. Explain prototypal inheritance in JavaScript.

**CSS & Styling**
12. Explain the difference between CSS Grid and Flexbox.
13. Explain the box model in CSS.
14. What are CSS preprocessors and why use them?
15. How would you implement responsive design?
16. How would you implement dark mode?
17. Explain CSS-in-JS solutions.
18. What is the BEM methodology?

**React & Frameworks**
19. What is the virtual DOM and how does it work?
20. How would you optimize the performance of a React application?
21. How do you handle state management in large applications?
22. Explain React hooks and their rules.
23. What is the useEffect cleanup function for?
24. How would you optimize React re-renders?
25. Explain the Context API vs Redux.
26. What is code splitting in React?
27. How would you handle forms in React?
28. Explain controlled vs uncontrolled components.
29. What is the difference between useMemo and useCallback?
30. How would you handle errors in React?
31. Explain React Suspense and lazy loading.
32. What are render props?

**Performance & Optimization**
33. How would you implement infinite scrolling?
34. Explain the difference between SSR and CSR.
35. How would you implement lazy loading?
36. Explain the critical rendering path.
37. What is tree shaking?
38. How would you optimize images for the web?
39. Explain service workers and PWAs.

**Testing & Best Practices**
40. How would you test React components?
41. Explain snapshot testing.
42. What is end-to-end testing?
43. What are web accessibility best practices?
44. How do you handle cross-browser compatibility issues?
45. What is CORS and how do you handle it?
46. How would you implement authentication in a SPA?

**Architecture**
47. What are Web Components?
48. How would you handle internationalization?
49. Explain micro-frontends architecture.
50. What are the best practices for SEO in SPAs?

### Backend Developer Questions (50)

**API Design**
1. How would you design a RESTful API for a social media app?
2. Explain the difference between REST and gRPC.
3. How would you implement pagination?
4. Explain API versioning strategies.
5. What is GraphQL and when would you use it?
6. How would you implement webhooks?
7. Explain idempotency in APIs.
8. What is HATEOAS?
9. How would you document an API?
10. Explain OpenAPI/Swagger.

**Database**
11. Explain database indexing and when to use it.
12. What is the difference between SQL and NoSQL databases?
13. Explain the concept of database transactions and ACID properties.
14. How would you design database schema for a blog?
15. What is database normalization?
16. What is connection pooling?
17. How would you handle database migrations?
18. Explain optimistic vs pessimistic locking.
19. What is eventual consistency?
20. What is database sharding and when would you use it?
21. Explain the CAP theorem.
22. Explain database replication.
23. What is read replica?
24. How would you implement full-text search?
25. Explain Elasticsearch basics.
26. What is database connection management?

**Security**
27. How would you handle authentication and authorization?
28. Explain OAuth 2.0 flow.
29. What is JWT and how does it work?
30. How would you prevent SQL injection?
31. Explain XSS and CSRF attacks.
32. What is input validation best practice?
33. How would you secure an API against common vulnerabilities?

**Architecture & Patterns**
34. How would you implement rate limiting for an API?
35. What is caching and what strategies would you use?
36. How would you handle file uploads in a scalable way?
37. Explain microservices vs monolithic architecture.
38. How would you implement a job queue?
39. Explain message brokers like RabbitMQ or Kafka.
40. What is the saga pattern?
41. How would you handle distributed transactions?
42. What is circuit breaker pattern?
43. What is serverless architecture?
44. How would you handle cold starts?

**Monitoring & Operations**
45. How would you implement logging?
46. Explain structured logging.
47. What is distributed tracing?
48. How would you monitor API performance?
49. Explain health checks and readiness probes.
50. How would you handle API errors gracefully?

### DevOps Engineer Questions (50)

**CI/CD**
1. Explain the CI/CD pipeline you would set up for a new project.
2. How would you implement canary deployments?
3. What is feature flagging?
4. How would you manage database schema changes?
5. Explain zero-downtime deployments.
6. How would you implement blue-green deployments?

**Infrastructure as Code**
7. How would you implement infrastructure as code?
8. Explain Terraform and its benefits.
9. What is infrastructure drift?
10. How would you handle multi-cloud deployments?
11. Explain the concept of immutable infrastructure.

**Containers & Orchestration**
12. Explain containerization and when to use Docker vs VMs.
13. What is Kubernetes and when would you use it?
14. How would you manage Kubernetes manifests?
15. What is Helm and when would you use it?
16. Explain the difference between Deployment and StatefulSet.
17. How would you handle persistent storage in Kubernetes?
18. What is a service mesh?
19. Explain Istio or Linkerd basics.
20. What is container security?

**Monitoring & Observability**
21. What monitoring and alerting would you set up for a production system?
22. What is log aggregation?
23. How would you set up centralized logging?
24. Explain ELK stack or alternatives.
25. What is APM (Application Performance Monitoring)?
26. How would you create custom metrics?
27. Explain SLOs, SLIs, and SLAs.
28. What is distributed tracing?

**Security & Compliance**
29. How would you handle secrets management?
30. How would you implement security scanning?
31. Explain SAST vs DAST.
32. How would you handle compliance requirements?
33. Explain audit logging.

**Reliability & Disaster Recovery**
34. Describe your approach to disaster recovery.
35. How would you troubleshoot a production incident?
36. How would you implement backup strategies?
37. Explain RPO and RTO.
38. What is chaos engineering?
39. What is on-call rotation best practices?
40. How would you write runbooks?
41. Explain incident management process.

**Scaling & Performance**
42. How would you implement auto-scaling?
43. Explain horizontal vs vertical scaling.
44. What is a load balancer and types?
45. How would you set up SSL/TLS certificates?
46. Explain DNS and CDN basics.
47. What is DDoS protection?
48. Explain cloud cost optimization strategies.
49. What is FinOps?
50. How do you manage configuration across environments?

### System Design Questions (50)

**Classic Systems**
1. Design a URL shortener like bit.ly.
2. Design a chat application like WhatsApp.
3. Design a news feed system like Facebook.
4. Design a rate limiter for an API.
5. Design a distributed cache system.
6. Design a notification system.
7. Design a file storage system like Dropbox.
8. Design a search autocomplete system.
9. Design a video streaming platform like YouTube.
10. Design a ride-sharing system like Uber.
11. Design a web crawler.
12. Design a distributed message queue.

**Social & Content Platforms**
13. Design Twitter's trending topics.
14. Design a social network like LinkedIn.
15. Design a photo sharing app like Instagram.
16. Design a music streaming service like Spotify.
17. Design a comment system for a blog.
18. Design a poll/voting system.
19. Design a newsletter subscription system.

**E-commerce & Booking**
20. Design a payment processing system.
21. Design an e-commerce platform like Amazon.
22. Design a hotel booking system.
23. Design a food delivery app like DoorDash.
24. Design a ticket booking system like BookMyShow.
25. Design a coupon/discount system.
26. Design an inventory management system.

**Infrastructure**
27. Design a key-value store.
28. Design a distributed file system.
29. Design a content delivery network (CDN).
30. Design a load balancer.
31. Design a search engine like Google.
32. Design an API gateway.
33. Design a feature flag system.
34. Design a logging and monitoring system.
35. Design a data pipeline for analytics.

**Communication & Collaboration**
36. Design an email system like Gmail.
37. Design a collaborative document editor like Google Docs.
38. Design a video conferencing system like Zoom.
39. Design a real-time collaboration tool.
40. Design a calendar scheduling system.

**Specialized Systems**
41. Design a stock trading platform.
42. Design a weather forecasting system.
43. Design a fraud detection system.
44. Design a recommendation engine.
45. Design a parking lot system.
46. Design an elevator system.
47. Design a leaderboard for a gaming platform.
48. Design a location-based service.
49. Design a multi-tenant SaaS platform.
50. Design a URL redirect service.

### Behavioral Questions (50)

**Challenges & Problem Solving**
1. Tell me about a time you faced a significant challenge at work.
2. Describe a time you failed and what you learned from it.
3. Tell me about a mistake you made and how you handled it.
4. How do you handle tight deadlines and pressure?
5. How do you handle ambiguity in projects?
6. Describe a time you had to make a decision with incomplete information.
7. Describe a time you had to deal with ambiguous requirements.
8. How do you approach problem-solving?

**Teamwork & Collaboration**
9. Describe a situation where you had to work with a difficult team member.
10. Tell me about a conflict you resolved at work.
11. How do you build relationships with new team members?
12. Tell me about a time you collaborated across teams.
13. Describe your communication style.
14. How do you build trust with your team?

**Leadership & Initiative**
15. Tell me about a time you showed leadership.
16. Describe a time you took initiative.
17. Tell me about a time you influenced without authority.
18. Describe a time you had to persuade others to your point of view.
19. Tell me about a time you mentored someone.
20. How do you celebrate team successes?

**Achievement & Growth**
21. Tell me about a project you're most proud of.
22. Describe a time you went above and beyond for a project.
23. Tell me about your biggest professional achievement.
24. Describe a time you received praise for your work.
25. Tell me about a time you simplified something complex.

**Adaptability & Learning**
26. Tell me about a time you had to learn something new quickly.
27. Tell me about a time you had to adapt to change.
28. Tell me about a time you had to pivot quickly.
29. How do you approach continuous learning?
30. How do you stay updated with industry trends?

**Feedback & Communication**
31. Tell me about a time you received critical feedback.
32. How do you handle feedback you disagree with?
33. Describe a time you had to deliver bad news.
34. Tell me about your approach to giving feedback.
35. Tell me about a time you disagreed with your manager.

**Prioritization & Time Management**
36. How do you prioritize when you have multiple urgent tasks?
37. How do you handle multiple stakeholders with different priorities?
38. How do you handle scope changes in a project?
39. How do you handle competing priorities?
40. Tell me about a time you had to meet a tight deadline.

**Quality & Process**
41. Describe a time you improved a process.
42. How do you ensure quality in your work?
43. Describe a time you had to balance quality vs speed.
44. Describe a time you had to work with limited resources.

**Personal & Cultural**
45. How do you stay motivated during challenging times?
46. How do you handle stress?
47. Describe your approach to work-life balance.
48. Describe your ideal work environment.
49. Describe a time you took a risk.
50. Why are you interested in this role?

---

## Voice Features

The application includes voice input/output capabilities using the browser's Web Speech API.

### Speech-to-Text (Voice Input)
- Uses `SpeechRecognition` API (Chrome, Edge, Safari)
- Real-time transcription with interim results
- Auto-submit when speech ends
- Visual feedback during recording (pulsing red indicator)

### Text-to-Speech (Voice Output)
- Uses `SpeechSynthesis` API (all modern browsers)
- AI responses are automatically read aloud
- Click speaker icon to replay any message
- Natural voice selection when available

### Implementation
Voice features are implemented entirely client-side, requiring no backend changes. This keeps the solution lightweight and avoids additional API costs.
