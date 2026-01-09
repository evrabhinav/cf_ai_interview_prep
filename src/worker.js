/**
 * AI Interview Prep Worker
 * Cloudflare Workers AI + D1 Database
 */

// Available interview roles
const ROLES = [
  { id: 'software-engineer', name: 'Software Engineer', icon: '💻' },
  { id: 'product-manager', name: 'Product Manager', icon: '📊' },
  { id: 'data-scientist', name: 'Data Scientist', icon: '📈' },
  { id: 'frontend-developer', name: 'Frontend Developer', icon: '🎨' },
  { id: 'backend-developer', name: 'Backend Developer', icon: '⚙️' },
  { id: 'devops-engineer', name: 'DevOps Engineer', icon: '🚀' },
  { id: 'system-design', name: 'System Design', icon: '🏗️' },
  { id: 'behavioral', name: 'Behavioral', icon: '🤝' },
];

// Difficulty levels
const DIFFICULTIES = {
  easy: { name: 'Easy', multiplier: 0.7 },
  medium: { name: 'Medium', multiplier: 1.0 },
  hard: { name: 'Hard', multiplier: 1.3 },
};

// System prompts for different AI roles
const SYSTEM_PROMPTS = {
  interviewer: (role, difficulty) => `You are an experienced technical interviewer conducting a ${difficulty} level interview for a ${role} position at a top tech company.

Your responsibilities:
1. Ask relevant, challenging interview questions appropriate for the ${role} role
2. Follow up on answers with probing questions
3. Provide hints if the candidate is stuck (but not the answer)
4. Keep the conversation professional and encouraging
5. Ask one question at a time
6. Adapt difficulty based on candidate responses

For ${role} interviews, focus on:
${getRoleFocus(role)}

Start by introducing yourself briefly and asking your first question. Keep responses concise and focused.`,

  evaluator: (role, difficulty) => `You are an expert interview evaluator assessing a candidate's response for a ${role} position.

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

Be fair but rigorous. A score of 7+ indicates a strong answer, 5-6 is acceptable, below 5 needs improvement.`,
};

// Question banks for each role (50 questions each)
const QUESTION_BANKS = {
  'software-engineer': [
    "Explain the difference between a stack and a queue. When would you use each?",
    "How would you find the middle element of a linked list in one pass?",
    "Explain time and space complexity. What is Big O notation?",
    "How would you detect a cycle in a linked list?",
    "Explain the difference between BFS and DFS. When would you use each?",
    "How would you reverse a linked list?",
    "What is a hash table and how does it handle collisions?",
    "Explain dynamic programming with an example.",
    "How would you design a LRU cache?",
    "What is the difference between a process and a thread?",
    "Explain how garbage collection works.",
    "What are the SOLID principles? Explain each one.",
    "How would you implement a binary search tree?",
    "Explain the difference between arrays and linked lists.",
    "What is recursion and when should you use it?",
    "How would you find the kth largest element in an array?",
    "Explain merge sort and its time complexity.",
    "What is a heap data structure and when would you use it?",
    "How would you detect duplicates in an array?",
    "Explain the concept of memoization.",
    "What is a graph and how would you represent it in code?",
    "How would you find the shortest path in an unweighted graph?",
    "Explain the difference between a tree and a graph.",
    "What is a balanced binary tree?",
    "How would you serialize and deserialize a binary tree?",
    "Explain quicksort and its average/worst case complexity.",
    "What is a trie and when would you use it?",
    "How would you implement a queue using two stacks?",
    "Explain the sliding window technique with an example.",
    "What is the two-pointer technique?",
    "How would you find all permutations of a string?",
    "Explain the difference between concurrency and parallelism.",
    "What is deadlock and how can you prevent it?",
    "How would you implement a thread-safe singleton?",
    "Explain memory management in your preferred language.",
    "What is the difference between stack and heap memory?",
    "How would you optimize a slow-running algorithm?",
    "Explain the concept of amortized time complexity.",
    "What is a bloom filter and when would you use it?",
    "How would you implement an LFU cache?",
    "Explain consistent hashing.",
    "What is the difference between TCP and UDP?",
    "How does HTTP/2 differ from HTTP/1.1?",
    "Explain REST vs GraphQL.",
    "What is WebSocket and when would you use it?",
    "How would you handle race conditions?",
    "Explain the producer-consumer problem.",
    "What is a semaphore vs a mutex?",
    "How would you design a thread pool?",
    "Explain the CAP theorem and its implications."
  ],
  'product-manager': [
    "How would you prioritize features for a new product launch?",
    "Tell me about a product you admire and why.",
    "How would you measure the success of a new feature?",
    "Walk me through how you would conduct user research.",
    "How do you handle disagreements with engineering about priorities?",
    "Describe your approach to writing a PRD.",
    "How would you decide whether to build vs buy a solution?",
    "Tell me about a time you had to pivot a product strategy.",
    "How do you balance user needs with business goals?",
    "How would you improve our competitor's product?",
    "Describe your approach to roadmap planning.",
    "How do you gather and incorporate customer feedback?",
    "What metrics would you track for a subscription product?",
    "How would you launch a product in a new market?",
    "Describe your experience with A/B testing.",
    "How do you communicate product decisions to stakeholders?",
    "What's your process for defining product requirements?",
    "How would you handle a feature that's not performing well?",
    "Describe how you work with design teams.",
    "How do you stay informed about market trends?",
    "What's your approach to competitive analysis?",
    "How would you price a new product?",
    "Describe your experience with agile methodologies.",
    "How do you handle technical debt discussions?",
    "What's your approach to MVP definition?",
    "How would you increase user engagement?",
    "Describe a time you had to say no to a stakeholder.",
    "How do you measure product-market fit?",
    "What's your approach to user segmentation?",
    "How would you reduce customer churn?",
    "Describe your experience with go-to-market strategies.",
    "How do you align product goals with company OKRs?",
    "What's your approach to feature deprecation?",
    "How would you handle a product crisis?",
    "Describe your experience with data-driven decisions.",
    "How do you prioritize bug fixes vs new features?",
    "What's your approach to internationalization?",
    "How would you improve user onboarding?",
    "Describe your experience with platform products.",
    "How do you handle conflicting user feedback?",
    "What's your approach to product documentation?",
    "How would you build a product community?",
    "Describe your experience with B2B vs B2C products.",
    "How do you measure customer satisfaction?",
    "What's your approach to product analytics?",
    "How would you handle scope creep?",
    "Describe your experience with product launches.",
    "How do you build relationships with engineering?",
    "What's your approach to risk assessment?",
    "How would you validate a new product idea?"
  ],
  'data-scientist': [
    "Explain the bias-variance tradeoff.",
    "How would you handle missing data in a dataset?",
    "What is the difference between supervised and unsupervised learning?",
    "Explain cross-validation and why it's important.",
    "How would you detect and handle outliers?",
    "What metrics would you use for an imbalanced classification problem?",
    "Explain the difference between L1 and L2 regularization.",
    "How would you explain a complex model to a non-technical stakeholder?",
    "What is feature engineering and why is it important?",
    "How would you A/B test a new recommendation algorithm?",
    "Explain the difference between precision and recall.",
    "What is overfitting and how do you prevent it?",
    "Explain gradient descent and its variants.",
    "What is the curse of dimensionality?",
    "How would you handle categorical variables?",
    "Explain the difference between bagging and boosting.",
    "What is a confusion matrix?",
    "How would you select features for a model?",
    "Explain ROC curves and AUC.",
    "What is the difference between generative and discriminative models?",
    "How would you handle time series data?",
    "Explain the concept of ensemble learning.",
    "What is transfer learning?",
    "How would you deploy a machine learning model?",
    "Explain the difference between batch and online learning.",
    "What is dropout and why is it used?",
    "How would you handle multi-collinearity?",
    "Explain the K-means clustering algorithm.",
    "What is PCA and when would you use it?",
    "How would you evaluate a clustering model?",
    "Explain neural network backpropagation.",
    "What is a convolutional neural network?",
    "How would you handle text data for NLP?",
    "Explain word embeddings like Word2Vec.",
    "What is attention mechanism in deep learning?",
    "How would you build a recommendation system?",
    "Explain collaborative vs content-based filtering.",
    "What is the cold start problem?",
    "How would you detect anomalies in data?",
    "Explain hypothesis testing.",
    "What is p-value and statistical significance?",
    "How would you design an experiment?",
    "Explain Bayesian vs frequentist approaches.",
    "What is survival analysis?",
    "How would you handle seasonality in forecasting?",
    "Explain ARIMA models.",
    "What is causal inference?",
    "How would you measure model drift?",
    "Explain MLOps and model monitoring.",
    "What ethical considerations exist in ML?"
  ],
  'frontend-developer': [
    "Explain the difference between CSS Grid and Flexbox.",
    "What is the virtual DOM and how does it work?",
    "How would you optimize the performance of a React application?",
    "Explain event delegation in JavaScript.",
    "What is the difference between == and === in JavaScript?",
    "How do you handle state management in large applications?",
    "Explain the concept of closures in JavaScript.",
    "What are web accessibility best practices?",
    "How would you implement infinite scrolling?",
    "Explain the difference between SSR and CSR.",
    "What is the event loop in JavaScript?",
    "How do you handle cross-browser compatibility issues?",
    "Explain the box model in CSS.",
    "What are CSS preprocessors and why use them?",
    "How would you implement responsive design?",
    "Explain the difference between let, const, and var.",
    "What is hoisting in JavaScript?",
    "How do promises work in JavaScript?",
    "Explain async/await syntax.",
    "What is the difference between null and undefined?",
    "How would you debounce or throttle a function?",
    "Explain prototypal inheritance in JavaScript.",
    "What are Web Components?",
    "How would you implement lazy loading?",
    "Explain the critical rendering path.",
    "What is tree shaking?",
    "How would you optimize images for the web?",
    "Explain service workers and PWAs.",
    "What is CORS and how do you handle it?",
    "How would you implement authentication in a SPA?",
    "Explain React hooks and their rules.",
    "What is the useEffect cleanup function for?",
    "How would you optimize React re-renders?",
    "Explain the Context API vs Redux.",
    "What is code splitting in React?",
    "How would you test React components?",
    "Explain snapshot testing.",
    "What is end-to-end testing?",
    "How would you handle forms in React?",
    "Explain controlled vs uncontrolled components.",
    "What is the difference between useMemo and useCallback?",
    "How would you handle errors in React?",
    "Explain React Suspense and lazy loading.",
    "What are render props?",
    "How would you implement dark mode?",
    "Explain CSS-in-JS solutions.",
    "What is the BEM methodology?",
    "How would you handle internationalization?",
    "Explain micro-frontends architecture.",
    "What are the best practices for SEO in SPAs?"
  ],
  'backend-developer': [
    "How would you design a RESTful API for a social media app?",
    "Explain database indexing and when to use it.",
    "What is the difference between SQL and NoSQL databases?",
    "How would you handle authentication and authorization?",
    "Explain the concept of database transactions and ACID properties.",
    "How would you implement rate limiting for an API?",
    "What is caching and what strategies would you use?",
    "How would you handle file uploads in a scalable way?",
    "Explain microservices vs monolithic architecture.",
    "How would you secure an API against common vulnerabilities?",
    "What is database sharding and when would you use it?",
    "Explain the CAP theorem.",
    "How would you design database schema for a blog?",
    "What is database normalization?",
    "Explain the difference between REST and gRPC.",
    "How would you implement pagination?",
    "What is connection pooling?",
    "How would you handle database migrations?",
    "Explain optimistic vs pessimistic locking.",
    "What is eventual consistency?",
    "How would you implement a job queue?",
    "Explain message brokers like RabbitMQ or Kafka.",
    "What is the saga pattern?",
    "How would you handle distributed transactions?",
    "Explain API versioning strategies.",
    "What is GraphQL and when would you use it?",
    "How would you implement webhooks?",
    "Explain OAuth 2.0 flow.",
    "What is JWT and how does it work?",
    "How would you prevent SQL injection?",
    "Explain XSS and CSRF attacks.",
    "What is input validation best practice?",
    "How would you implement logging?",
    "Explain structured logging.",
    "What is distributed tracing?",
    "How would you monitor API performance?",
    "Explain health checks and readiness probes.",
    "What is circuit breaker pattern?",
    "How would you handle API errors gracefully?",
    "Explain idempotency in APIs.",
    "What is HATEOAS?",
    "How would you document an API?",
    "Explain OpenAPI/Swagger.",
    "What is serverless architecture?",
    "How would you handle cold starts?",
    "Explain database replication.",
    "What is read replica?",
    "How would you implement full-text search?",
    "Explain Elasticsearch basics.",
    "What is database connection management?"
  ],
  'devops-engineer': [
    "Explain the CI/CD pipeline you would set up for a new project.",
    "How would you implement infrastructure as code?",
    "What monitoring and alerting would you set up for a production system?",
    "Explain containerization and when to use Docker vs VMs.",
    "How would you handle secrets management?",
    "Describe your approach to disaster recovery.",
    "How would you implement blue-green deployments?",
    "What is Kubernetes and when would you use it?",
    "How would you troubleshoot a production incident?",
    "Explain the concept of immutable infrastructure.",
    "How do you manage configuration across environments?",
    "What is GitOps and how does it work?",
    "Explain Terraform and its benefits.",
    "How would you manage Kubernetes manifests?",
    "What is Helm and when would you use it?",
    "Explain the difference between Deployment and StatefulSet.",
    "How would you handle persistent storage in Kubernetes?",
    "What is a service mesh?",
    "Explain Istio or Linkerd basics.",
    "How would you implement canary deployments?",
    "What is feature flagging?",
    "How would you manage database schema changes?",
    "Explain zero-downtime deployments.",
    "What is infrastructure drift?",
    "How would you handle multi-cloud deployments?",
    "Explain cloud cost optimization strategies.",
    "What is FinOps?",
    "How would you implement auto-scaling?",
    "Explain horizontal vs vertical scaling.",
    "What is a load balancer and types?",
    "How would you set up SSL/TLS certificates?",
    "Explain DNS and CDN basics.",
    "What is DDoS protection?",
    "How would you implement backup strategies?",
    "Explain RPO and RTO.",
    "What is chaos engineering?",
    "How would you implement security scanning?",
    "Explain SAST vs DAST.",
    "What is container security?",
    "How would you handle compliance requirements?",
    "Explain audit logging.",
    "What is log aggregation?",
    "How would you set up centralized logging?",
    "Explain ELK stack or alternatives.",
    "What is APM (Application Performance Monitoring)?",
    "How would you create custom metrics?",
    "Explain SLOs, SLIs, and SLAs.",
    "What is on-call rotation best practices?",
    "How would you write runbooks?",
    "Explain incident management process."
  ],
  'system-design': [
    "Design a URL shortener like bit.ly.",
    "Design a chat application like WhatsApp.",
    "Design a news feed system like Facebook.",
    "Design a rate limiter for an API.",
    "Design a distributed cache system.",
    "Design a notification system.",
    "Design a file storage system like Dropbox.",
    "Design a search autocomplete system.",
    "Design a video streaming platform like YouTube.",
    "Design a ride-sharing system like Uber.",
    "Design a web crawler.",
    "Design a distributed message queue.",
    "Design Twitter's trending topics.",
    "Design a payment processing system.",
    "Design an e-commerce platform like Amazon.",
    "Design a hotel booking system.",
    "Design a food delivery app like DoorDash.",
    "Design a social network like LinkedIn.",
    "Design a photo sharing app like Instagram.",
    "Design a music streaming service like Spotify.",
    "Design a ticket booking system like BookMyShow.",
    "Design a parking lot system.",
    "Design an elevator system.",
    "Design a key-value store.",
    "Design a distributed file system.",
    "Design a content delivery network (CDN).",
    "Design a load balancer.",
    "Design a search engine like Google.",
    "Design an email system like Gmail.",
    "Design a collaborative document editor like Google Docs.",
    "Design a video conferencing system like Zoom.",
    "Design a stock trading platform.",
    "Design a weather forecasting system.",
    "Design a fraud detection system.",
    "Design a recommendation engine.",
    "Design a logging and monitoring system.",
    "Design a URL redirect service.",
    "Design a comment system for a blog.",
    "Design a poll/voting system.",
    "Design a leaderboard for a gaming platform.",
    "Design a coupon/discount system.",
    "Design an inventory management system.",
    "Design a calendar scheduling system.",
    "Design a location-based service.",
    "Design a real-time collaboration tool.",
    "Design a newsletter subscription system.",
    "Design an API gateway.",
    "Design a feature flag system.",
    "Design a multi-tenant SaaS platform.",
    "Design a data pipeline for analytics."
  ],
  'behavioral': [
    "Tell me about a time you faced a significant challenge at work.",
    "Describe a situation where you had to work with a difficult team member.",
    "Tell me about a project you're most proud of.",
    "How do you handle tight deadlines and pressure?",
    "Describe a time you failed and what you learned from it.",
    "Tell me about a time you had to learn something new quickly.",
    "How do you prioritize when you have multiple urgent tasks?",
    "Describe a time you went above and beyond for a project.",
    "Tell me about a time you received critical feedback.",
    "How do you stay updated with industry trends?",
    "Describe a time you had to persuade others to your point of view.",
    "Tell me about a time you showed leadership.",
    "How do you handle ambiguity in projects?",
    "Describe a time you had to make a decision with incomplete information.",
    "Tell me about a conflict you resolved at work.",
    "How do you build relationships with new team members?",
    "Describe a time you improved a process.",
    "Tell me about a time you mentored someone.",
    "How do you handle feedback you disagree with?",
    "Describe your approach to work-life balance.",
    "Tell me about a time you had to adapt to change.",
    "How do you handle multiple stakeholders with different priorities?",
    "Describe a time you took initiative.",
    "Tell me about a mistake you made and how you handled it.",
    "How do you stay motivated during challenging times?",
    "Describe a time you had to deliver bad news.",
    "Tell me about a time you collaborated across teams.",
    "How do you handle scope changes in a project?",
    "Describe your communication style.",
    "Tell me about a time you had to meet a tight deadline.",
    "How do you approach problem-solving?",
    "Describe a time you had to deal with ambiguous requirements.",
    "Tell me about a time you disagreed with your manager.",
    "How do you ensure quality in your work?",
    "Describe a time you had to balance quality vs speed.",
    "Tell me about your biggest professional achievement.",
    "How do you handle stress?",
    "Describe a time you had to work with limited resources.",
    "Tell me about a time you influenced without authority.",
    "How do you approach continuous learning?",
    "Describe a time you received praise for your work.",
    "Tell me about a time you had to pivot quickly.",
    "How do you build trust with your team?",
    "Describe your ideal work environment.",
    "Tell me about a time you simplified something complex.",
    "How do you handle competing priorities?",
    "Describe a time you took a risk.",
    "Tell me about your approach to giving feedback.",
    "How do you celebrate team successes?",
    "Why are you interested in this role?"
  ]
};

function getRoleFocus(role) {
  const questions = QUESTION_BANKS[role] || QUESTION_BANKS['software-engineer'];
  const focuses = {
    'software-engineer': `- Data structures and algorithms
- Code optimization and complexity analysis
- System design basics
- Problem-solving methodology`,
    'product-manager': `- Product strategy and vision
- User research and metrics
- Prioritization frameworks
- Cross-functional collaboration`,
    'data-scientist': `- Statistical analysis and ML concepts
- Data manipulation and visualization
- Model selection and evaluation
- Business impact of data insights`,
    'frontend-developer': `- HTML, CSS, JavaScript fundamentals
- React/Vue/Angular frameworks
- Performance optimization
- Accessibility and UX principles`,
    'backend-developer': `- API design and RESTful principles
- Database design and optimization
- Scalability and performance
- Security best practices`,
    'devops-engineer': `- CI/CD pipelines
- Infrastructure as Code
- Monitoring and observability
- Cloud platforms (AWS, GCP, Azure)`,
    'system-design': `- Scalability and distributed systems
- Database choices and trade-offs
- Caching strategies
- Load balancing and fault tolerance`,
    'behavioral': `- Leadership and teamwork examples
- Conflict resolution
- Project management experience
- Growth mindset and learning`,
  };

  // Select 15 random questions to include in prompt
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffled.slice(0, 15);

  return `${focuses[role] || focuses['software-engineer']}

Sample questions to draw from (vary your questions each session):
${selectedQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`;
}

// Generate unique IDs
function generateId() {
  return crypto.randomUUID();
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// JSON response helper
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

// Error response helper
function errorResponse(message, status = 400) {
  return jsonResponse({ error: message }, status);
}

// Main request handler
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // API Routes
    if (path.startsWith('/api/')) {
      try {
        // GET /api/roles - Get available interview roles
        if (path === '/api/roles' && request.method === 'GET') {
          return jsonResponse({ roles: ROLES, difficulties: Object.keys(DIFFICULTIES) });
        }

        // POST /api/session/start - Start a new interview session
        if (path === '/api/session/start' && request.method === 'POST') {
          const { userId, role, difficulty } = await request.json();

          if (!userId || !role) {
            return errorResponse('userId and role are required');
          }

          const sessionId = generateId();
          const difficultyLevel = difficulty || 'medium';

          // Create user if not exists
          await env.DB.prepare(
            `INSERT OR IGNORE INTO users (user_id) VALUES (?)`
          ).bind(userId).run();

          // Create session
          await env.DB.prepare(
            `INSERT INTO sessions (session_id, user_id, role, difficulty, status) VALUES (?, ?, ?, ?, 'active')`
          ).bind(sessionId, userId, role, difficultyLevel).run();

          // Generate opening message from AI interviewer
          const roleName = ROLES.find(r => r.id === role)?.name || role;
          const systemPrompt = SYSTEM_PROMPTS.interviewer(roleName, difficultyLevel);

          const aiResponse = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: 'Please start the interview.' },
            ],
            max_tokens: 500,
          });

          const openingMessage = aiResponse.response;

          // Store AI opening message
          await env.DB.prepare(
            `INSERT INTO conversations (session_id, role, content) VALUES (?, 'assistant', ?)`
          ).bind(sessionId, openingMessage).run();

          return jsonResponse({
            sessionId,
            role,
            difficulty: difficultyLevel,
            message: openingMessage,
          });
        }

        // POST /api/chat - Send a message in the interview
        if (path === '/api/chat' && request.method === 'POST') {
          const { sessionId, message } = await request.json();

          if (!sessionId || !message) {
            return errorResponse('sessionId and message are required');
          }

          // Get session info
          const session = await env.DB.prepare(
            `SELECT * FROM sessions WHERE session_id = ? AND status = 'active'`
          ).bind(sessionId).first();

          if (!session) {
            return errorResponse('Session not found or ended', 404);
          }

          // Store user message
          await env.DB.prepare(
            `INSERT INTO conversations (session_id, role, content) VALUES (?, 'user', ?)`
          ).bind(sessionId, message).run();

          // Get conversation history
          const history = await env.DB.prepare(
            `SELECT role, content FROM conversations WHERE session_id = ? ORDER BY timestamp ASC`
          ).bind(sessionId).all();

          // Build messages array for AI
          const roleName = ROLES.find(r => r.id === session.role)?.name || session.role;
          const systemPrompt = SYSTEM_PROMPTS.interviewer(roleName, session.difficulty);

          const messages = [
            { role: 'system', content: systemPrompt },
            ...history.results.map(h => ({
              role: h.role === 'user' ? 'user' : 'assistant',
              content: h.content,
            })),
          ];

          // Get AI interviewer response
          const aiResponse = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
            messages,
            max_tokens: 600,
          });

          const aiMessage = aiResponse.response;

          // Evaluate the user's response
          const evaluatorPrompt = SYSTEM_PROMPTS.evaluator(roleName, session.difficulty);
          const lastAiQuestion = history.results.filter(h => h.role === 'assistant').pop()?.content || '';

          const evaluationResponse = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
            messages: [
              { role: 'system', content: evaluatorPrompt },
              { role: 'user', content: `Question asked: "${lastAiQuestion}"\n\nCandidate's response: "${message}"` },
            ],
            max_tokens: 300,
          });

          let evaluation = { score: 0, strengths: [], improvements: [], feedback: '' };
          try {
            // Try to parse JSON from evaluation response
            let evalText = evaluationResponse.response;

            // Handle case where response might not be a string
            if (typeof evalText !== 'string') {
              evalText = JSON.stringify(evalText);
            }

            if (evalText) {
              const jsonMatch = evalText.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                evaluation = JSON.parse(jsonMatch[0]);
              }
            }
          } catch (e) {
            console.error('Failed to parse evaluation:', e);
          }

          // Store AI response with evaluation
          await env.DB.prepare(
            `INSERT INTO conversations (session_id, role, content, score, feedback) VALUES (?, 'assistant', ?, ?, ?)`
          ).bind(sessionId, aiMessage, evaluation.score, JSON.stringify(evaluation)).run();

          return jsonResponse({
            message: aiMessage,
            evaluation,
          });
        }

        // POST /api/session/end - End an interview session
        if (path === '/api/session/end' && request.method === 'POST') {
          const { sessionId } = await request.json();

          if (!sessionId) {
            return errorResponse('sessionId is required');
          }

          // Get session info
          const session = await env.DB.prepare(
            `SELECT * FROM sessions WHERE session_id = ?`
          ).bind(sessionId).first();

          if (!session) {
            return errorResponse('Session not found', 404);
          }

          // Get all conversations with scores
          const conversations = await env.DB.prepare(
            `SELECT * FROM conversations WHERE session_id = ? ORDER BY timestamp ASC`
          ).bind(sessionId).all();

          // Calculate overall score
          const scores = conversations.results
            .filter(c => c.score !== null && c.score > 0)
            .map(c => c.score);

          const overallScore = scores.length > 0
            ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
            : 0;

          // Generate final feedback using AI
          const conversationText = conversations.results
            .map(c => `${c.role}: ${c.content}`)
            .join('\n\n');

          const finalFeedbackResponse = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
            messages: [
              {
                role: 'system',
                content: `You are an interview coach providing final feedback. Summarize the candidate's performance in 2-3 paragraphs. Be constructive and specific. Mention key strengths and areas for improvement.`,
              },
              {
                role: 'user',
                content: `Here's the interview transcript:\n\n${conversationText}\n\nProvide final feedback for this candidate.`,
              },
            ],
            max_tokens: 400,
          });

          const finalFeedback = finalFeedbackResponse.response;

          // Update session
          await env.DB.prepare(
            `UPDATE sessions SET status = 'completed', ended_at = CURRENT_TIMESTAMP, overall_score = ?, feedback = ? WHERE session_id = ?`
          ).bind(overallScore, finalFeedback, sessionId).run();

          // Update progress
          const existingProgress = await env.DB.prepare(
            `SELECT * FROM progress WHERE user_id = ? AND role = ?`
          ).bind(session.user_id, session.role).first();

          if (existingProgress) {
            const newSessionsCompleted = existingProgress.sessions_completed + 1;
            const newAverageScore = ((existingProgress.average_score * existingProgress.sessions_completed) + overallScore) / newSessionsCompleted;
            const newBestScore = Math.max(existingProgress.best_score, overallScore);
            const newTotalQuestions = existingProgress.total_questions + scores.length;

            await env.DB.prepare(
              `UPDATE progress SET sessions_completed = ?, average_score = ?, best_score = ?, total_questions = ?, last_practice = CURRENT_TIMESTAMP WHERE user_id = ? AND role = ?`
            ).bind(newSessionsCompleted, newAverageScore, newBestScore, newTotalQuestions, session.user_id, session.role).run();
          } else {
            await env.DB.prepare(
              `INSERT INTO progress (user_id, role, sessions_completed, average_score, best_score, total_questions) VALUES (?, ?, 1, ?, ?, ?)`
            ).bind(session.user_id, session.role, overallScore, overallScore, scores.length).run();
          }

          return jsonResponse({
            sessionId,
            overallScore,
            feedback: finalFeedback,
            questionsAnswered: scores.length,
          });
        }

        // GET /api/history - Get session history for a user
        if (path === '/api/history' && request.method === 'GET') {
          const userId = url.searchParams.get('userId');

          if (!userId) {
            return errorResponse('userId is required');
          }

          const sessions = await env.DB.prepare(
            `SELECT session_id, role, difficulty, status, started_at, ended_at, overall_score, feedback
             FROM sessions WHERE user_id = ? ORDER BY started_at DESC LIMIT 20`
          ).bind(userId).all();

          return jsonResponse({ sessions: sessions.results });
        }

        // GET /api/progress - Get user progress
        if (path === '/api/progress' && request.method === 'GET') {
          const userId = url.searchParams.get('userId');

          if (!userId) {
            return errorResponse('userId is required');
          }

          const progress = await env.DB.prepare(
            `SELECT * FROM progress WHERE user_id = ? ORDER BY last_practice DESC`
          ).bind(userId).all();

          return jsonResponse({ progress: progress.results });
        }

        // GET /api/session/:id - Get session details
        if (path.match(/^\/api\/session\/[^/]+$/) && request.method === 'GET') {
          const sessionId = path.split('/').pop();

          const session = await env.DB.prepare(
            `SELECT * FROM sessions WHERE session_id = ?`
          ).bind(sessionId).first();

          if (!session) {
            return errorResponse('Session not found', 404);
          }

          const conversations = await env.DB.prepare(
            `SELECT role, content, timestamp, score, feedback FROM conversations WHERE session_id = ? ORDER BY timestamp ASC`
          ).bind(sessionId).all();

          return jsonResponse({
            session,
            conversations: conversations.results,
          });
        }

        return errorResponse('Not found', 404);
      } catch (error) {
        console.error('API Error:', error);
        return errorResponse(`Internal server error: ${error.message}`, 500);
      }
    }

    // For non-API routes, let the assets handler serve static files
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    // Fallback: return 404 for unknown routes
    return new Response('Not Found', { status: 404 });
  },
};
