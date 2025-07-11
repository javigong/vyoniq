--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 17.2 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."User" VALUES ('user_2yQbLBJukarNLRkMZ4okDc84wLh', 'jgongora@gmail.com', 'Javier Gongora', true, true, true, '2025-06-13 04:40:45.139', NULL);
INSERT INTO public."User" VALUES ('user_2zAYZ1Gsg3WQyGTJx6oLYzPSHNP', '', '', false, false, false, '2025-06-29 05:36:56.832', NULL);


--
-- Data for Name: ApiKey; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."ApiKey" VALUES ('cmce1m4sa0001rqpln6tmlyy7', 'Test API Key', '$2b$12$w.wd75kAfKA/bRCdRLw/eO1BxWk/5y5eFQoHP9orXOAvHK2hiRzN.', 'vyoniq_sk_3b***', 'user_2yQbLBJukarNLRkMZ4okDc84wLh', '{blog:read,blog:write}', true, NULL, '2025-06-26 23:57:16.859', '2025-06-26 23:57:16.859');
INSERT INTO public."ApiKey" VALUES ('cmce2uhln0001rq59al00hrm6', 'Test API Key', '$2b$12$pSKu1ckDtd64R342OJUQn.dlHShOYXFswmRaqSShn2h6Ye8XowZgG', 'vyoniq_sk_65***', 'user_2yQbLBJukarNLRkMZ4okDc84wLh', '{blog:read,blog:write}', true, '2025-06-27 03:26:32.386', '2025-06-27 00:31:46.328', '2025-06-27 03:26:32.386');


--
-- Data for Name: BlogAuthor; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."BlogAuthor" VALUES ('cmcdwvy800000rq02usmp8q8l', 'Javier Gongora', '/javier.jpeg', 'Founder & Software Developer', 'Founder and lead developer at Vyoniq, specializing in AI-powered applications and enterprise software solutions.', '2025-06-26 21:44:56.833', '2025-06-26 21:44:56.833');


--
-- Data for Name: BlogCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."BlogCategory" VALUES ('cmcdwvyc30001rq02dh0ctac3', 'Cursor & AI IDEs', 'cursor--ai-ides', '2025-06-26 21:44:56.98');
INSERT INTO public."BlogCategory" VALUES ('cmcdwvysh0002rq028vyzi2dk', 'AI Development Tools', 'ai-development-tools', '2025-06-26 21:44:57.569');
INSERT INTO public."BlogCategory" VALUES ('cmcdwvz2c0003rq02nagpr1hf', 'Industry Trends', 'industry-trends', '2025-06-26 21:44:57.924');
INSERT INTO public."BlogCategory" VALUES ('cmcdwvzde0004rq02ihx2aqrx', 'MCP Servers', 'mcp-servers', '2025-06-26 21:44:58.322');
INSERT INTO public."BlogCategory" VALUES ('cmcdwvzoa0005rq02hi0fx3vs', 'LLM Integration', 'llm-integration', '2025-06-26 21:44:58.714');
INSERT INTO public."BlogCategory" VALUES ('cmcdwvzy50006rq02osjux56m', 'Enterprise Architecture', 'enterprise-architecture', '2025-06-26 21:44:59.069');
INSERT INTO public."BlogCategory" VALUES ('cmcdww08h0007rq023w6eydu7', 'AI Agents', 'ai-agents', '2025-06-26 21:44:59.442');
INSERT INTO public."BlogCategory" VALUES ('cmcdww0ig0008rq02qawnmxwx', 'Business Automation', 'business-automation', '2025-06-26 21:44:59.801');
INSERT INTO public."BlogCategory" VALUES ('cmcdww0sd0009rq025hasoq3c', 'Case Studies', 'case-studies', '2025-06-26 21:45:00.158');


--
-- Data for Name: BlogPost; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."BlogPost" VALUES ('cmcdww12x000brq028ueh8yut', 'cursor-ai-development-revolution', 'How Cursor is Revolutionizing AI-Powered Development', 'Explore how Cursor''s AI-first approach is transforming the development experience with intelligent code completion, chat-driven programming, and seamless LLM integration.', '
# How Cursor is Revolutionizing AI-Powered Development

Cursor has emerged as a game-changing AI-powered code editor that''s fundamentally transforming how developers write, debug, and maintain code. Built from the ground up with Large Language Models at its core, Cursor represents the next evolution of development environments.

## The AI-First Development Experience

Unlike traditional IDEs with AI features bolted on, Cursor was designed with AI as a fundamental component:

### Intelligent Code Completion
- Context-aware suggestions that understand your entire codebase
- Multi-line completions that anticipate your coding patterns
- Smart imports and dependency management
- Real-time code optimization suggestions

### Chat-Driven Programming
- Natural language to code conversion
- Contextual explanations of complex code blocks
- Interactive debugging assistance
- Architecture and design pattern recommendations

### Codebase Understanding
- Semantic search across your entire project
- Intelligent refactoring suggestions
- Automatic documentation generation
- Code review and quality analysis

## Real-World Impact on Development Teams

Organizations adopting Cursor are seeing remarkable improvements:

**Productivity Gains:**
- 40-60% faster feature development
- Reduced time spent on boilerplate code
- Faster onboarding for new team members
- More time for creative problem-solving

**Code Quality Improvements:**
- Fewer bugs through AI-assisted code review
- Better adherence to coding standards
- Improved documentation quality
- Enhanced security through automated vulnerability detection

**Developer Experience:**
- Reduced cognitive load during coding
- More intuitive debugging processes
- Seamless integration with existing workflows
- Enhanced learning opportunities through AI explanations

## Advanced Features for Professional Development

### Multi-Model Support
Cursor integrates with multiple LLMs to provide the best experience:
- GPT-4 for complex reasoning tasks
- Claude for detailed code analysis
- Custom models for domain-specific applications
- Local models for sensitive codebases

### Collaborative AI Development
- Shared AI context across team members
- Consistent coding patterns and standards
- Team-wide knowledge sharing through AI
- Collaborative debugging and problem-solving

### Enterprise Integration
- Secure deployment options
- Custom model training on proprietary codebases
- Integration with existing development tools
- Compliance with enterprise security requirements

## Best Practices for Cursor Adoption

To maximize the benefits of Cursor in your development workflow:

1. **Start with Clear Prompts**: Be specific about what you want the AI to accomplish
2. **Leverage Context**: Use the chat feature to explain complex requirements
3. **Review AI Suggestions**: Always validate AI-generated code for your specific use case
4. **Customize Settings**: Tailor the AI behavior to match your coding style
5. **Train Your Team**: Invest in proper onboarding to maximize adoption

## The Future of AI-Powered Development

Cursor represents just the beginning of AI-integrated development environments. We''re moving toward:
- Fully autonomous code generation for routine tasks
- AI-powered architecture design and system planning
- Intelligent project management and resource allocation
- Seamless integration between design, development, and deployment

At Vyoniq, we''re leveraging Cursor and similar AI development tools to deliver faster, higher-quality solutions for our clients while maintaining our focus on innovation and excellence.
    ', '/llms.jpeg', '2025-06-01 07:00:00', 7, true, 'rgba(14, 165, 233, 0.4)', true, 'cmcdwvy800000rq02usmp8q8l', '2025-06-26 21:45:00.537', '2025-06-26 21:45:00.537');
INSERT INTO public."BlogPost" VALUES ('cmcdww1p6000drq02w55ae3ni', 'mcp-servers-llm-integration', 'MCP Servers: The Future of LLM Integration', 'Discover how Model Context Protocol (MCP) servers are revolutionizing LLM integration, enabling seamless data access and intelligent automation across applications.', '
# MCP Servers: The Future of LLM Integration

Model Context Protocol (MCP) servers represent a paradigm shift in how Large Language Models interact with external systems and data sources. This standardized protocol is enabling unprecedented levels of integration between LLMs and business applications.

## Understanding MCP Architecture

MCP creates a standardized way for LLMs to access and interact with external resources:

### Core Components
- **MCP Servers**: Provide access to specific resources or capabilities
- **MCP Clients**: LLM applications that consume MCP services
- **Protocol Layer**: Standardized communication between clients and servers
- **Resource Abstraction**: Unified interface for diverse data sources

### Key Benefits
- Consistent integration patterns across different LLM providers
- Secure, controlled access to sensitive data
- Scalable architecture for enterprise deployments
- Simplified development of LLM-powered applications

## Real-World MCP Applications

### Database Integration
MCP servers can provide LLMs with secure access to databases:
- Natural language query generation
- Intelligent data analysis and reporting
- Automated data validation and cleanup
- Real-time business intelligence

### API Gateway Functionality
Transform existing APIs into LLM-accessible resources:
- Automatic API documentation and discovery
- Intelligent request routing and load balancing
- Authentication and authorization management
- Rate limiting and usage monitoring

### File System Access
Enable LLMs to work with file systems intelligently:
- Document analysis and summarization
- Automated file organization and tagging
- Content extraction and transformation
- Version control integration

### Business Process Automation
Connect LLMs to business workflows:
- Intelligent task routing and assignment
- Automated decision-making based on business rules
- Process optimization recommendations
- Exception handling and escalation

## Building Custom MCP Servers

### Development Considerations
When building MCP servers for your organization:

**Security First:**
- Implement robust authentication and authorization
- Use encryption for data in transit and at rest
- Apply principle of least privilege access
- Regular security audits and updates

**Performance Optimization:**
- Efficient caching strategies
- Connection pooling for database access
- Asynchronous processing for long-running tasks
- Monitoring and alerting for performance issues

**Scalability Planning:**
- Horizontal scaling capabilities
- Load balancing across multiple instances
- Resource usage monitoring and optimization
- Capacity planning for growth

### Integration Patterns

**Direct Integration:**
- Point-to-point connections between LLMs and data sources
- Suitable for simple, single-purpose applications
- Lower complexity but limited reusability

**Hub and Spoke:**
- Central MCP server managing multiple data sources
- Better for complex enterprise environments
- Improved security and governance

**Microservices Architecture:**
- Multiple specialized MCP servers
- Each server focused on specific capabilities
- Maximum flexibility and scalability

## Enterprise MCP Implementation

### Governance and Compliance
- Data access policies and audit trails
- Compliance with industry regulations
- Privacy protection and data anonymization
- Change management and version control

### Monitoring and Observability
- Real-time performance monitoring
- Usage analytics and optimization insights
- Error tracking and debugging capabilities
- Business impact measurement

### Team Training and Adoption
- Developer training on MCP protocols
- Best practices documentation
- Code review processes for MCP implementations
- Continuous learning and improvement

## The Future of MCP

As MCP adoption grows, we''re seeing exciting developments:
- Standardized MCP server libraries for common use cases
- Cloud-native MCP services from major providers
- Enhanced security and privacy features
- Integration with emerging AI agent frameworks

At Vyoniq, we''re at the forefront of MCP server development, helping organizations unlock the full potential of their data through intelligent LLM integration. Our expertise in both LLM technologies and enterprise architecture ensures secure, scalable, and effective MCP implementations.
    ', '/llms.jpeg', '2025-05-28 07:00:00', 7, true, 'rgba(168, 85, 247, 0.4)', true, 'cmcdwvy800000rq02usmp8q8l', '2025-06-26 21:45:01.338', '2025-06-26 21:45:01.338');
INSERT INTO public."BlogPost" VALUES ('cmcdww21s000frq02cwt2kvml', 'ai-agents-business-automation', 'AI Agents: Transforming Business Process Automation', 'Learn how AI agents powered by LLMs are revolutionizing business automation, from customer service to complex workflow orchestration.', '
# AI Agents: Transforming Business Process Automation

AI agents represent the next frontier in business automation, combining the reasoning capabilities of Large Language Models with the ability to take autonomous actions. These intelligent systems are transforming how organizations handle complex workflows and decision-making processes.

## Understanding AI Agent Architecture

### Core Components of AI Agents

**Reasoning Engine:**
- LLM-powered decision making
- Context understanding and memory
- Goal-oriented planning and execution
- Multi-step problem solving

**Action Framework:**
- Integration with business systems
- API calls and data manipulation
- File operations and document processing
- Communication and notification capabilities

**Memory and Context:**
- Persistent conversation history
- Knowledge base integration
- Learning from past interactions
- Contextual awareness across sessions

**Safety and Control:**
- Human oversight and approval workflows
- Action validation and rollback capabilities
- Compliance and audit trail maintenance
- Error handling and recovery mechanisms

## Business Applications of AI Agents

### Customer Service Automation

**Intelligent Ticket Routing:**
- Automatic categorization and prioritization
- Skill-based agent assignment
- Escalation path optimization
- SLA monitoring and compliance

**Autonomous Issue Resolution:**
- Common problem identification and solving
- Knowledge base consultation and updates
- Multi-system coordination for complex issues
- Customer communication and status updates

### Sales and Marketing Automation

**Lead Qualification and Nurturing:**
- Intelligent lead scoring and segmentation
- Personalized outreach campaigns
- Follow-up scheduling and management
- CRM data enrichment and maintenance

**Content Generation and Optimization:**
- Dynamic content creation for different audiences
- A/B testing and performance optimization
- Social media management and engagement
- Email campaign personalization

### Operations and Workflow Management

**Process Orchestration:**
- Multi-system workflow coordination
- Exception handling and decision making
- Resource allocation and scheduling
- Performance monitoring and optimization

**Data Processing and Analysis:**
- Automated report generation
- Anomaly detection and alerting
- Predictive analytics and forecasting
- Data quality monitoring and improvement

## Implementation Strategies

### Gradual Deployment Approach

**Phase 1: Observation and Learning**
- Deploy agents in read-only mode
- Monitor decision-making patterns
- Identify optimization opportunities
- Build confidence in agent capabilities

**Phase 2: Assisted Automation**
- Enable agents to suggest actions
- Require human approval for execution
- Collect feedback and improve performance
- Expand scope based on success metrics

**Phase 3: Autonomous Operation**
- Full automation for proven use cases
- Exception-based human intervention
- Continuous monitoring and optimization
- Scale to additional processes

### Technical Considerations

**Integration Architecture:**
- API-first design for system connectivity
- Event-driven architecture for real-time responses
- Microservices for scalability and maintainability
- Cloud-native deployment for flexibility

**Security and Compliance:**
- Role-based access control
- Audit logging for all agent actions
- Data encryption and privacy protection
- Compliance with industry regulations

**Performance and Reliability:**
- Load balancing and failover mechanisms
- Performance monitoring and alerting
- Capacity planning and auto-scaling
- Disaster recovery and business continuity

## Measuring AI Agent Success

### Key Performance Indicators

**Efficiency Metrics:**
- Process completion time reduction
- Error rate improvement
- Resource utilization optimization
- Cost savings achievement

**Quality Metrics:**
- Customer satisfaction scores
- Accuracy of automated decisions
- Compliance adherence rates
- Service level agreement performance

**Business Impact:**
- Revenue generation or protection
- Customer retention improvement
- Employee productivity gains
- Competitive advantage creation

### Continuous Improvement

**Performance Optimization:**
- Regular model fine-tuning
- Process refinement based on outcomes
- Integration enhancement and expansion
- User experience improvement

**Capability Expansion:**
- New use case identification
- Cross-functional process integration
- Advanced reasoning capability development
- Multi-agent coordination and collaboration

## The Future of AI Agents

Emerging trends in AI agent development:
- Multi-modal capabilities (text, voice, vision)
- Improved reasoning and planning abilities
- Better human-AI collaboration interfaces
- Industry-specific agent specialization

At Vyoniq, we specialize in designing and implementing AI agent solutions that transform business operations while maintaining human oversight and control. Our approach ensures that AI agents enhance rather than replace human capabilities, creating more efficient and effective business processes.
    ', '/llms.jpeg', '2025-05-15 07:00:00', 9, false, 'rgba(34, 197, 94, 0.4)', true, 'cmcdwvy800000rq02usmp8q8l', '2025-06-26 21:45:01.792', '2025-06-26 21:45:01.792');
INSERT INTO public."BlogPost" VALUES ('cmcdww2dg000hrq021e3na4b6', 'llm-integration-enterprise-applications', 'Best Practices for LLM Integration in Enterprise Applications', 'A comprehensive guide to integrating Large Language Models into enterprise applications, covering security, scalability, and performance considerations.', '
# Best Practices for LLM Integration in Enterprise Applications

Integrating Large Language Models into enterprise applications requires careful consideration of security, performance, scalability, and governance. This comprehensive guide outlines proven strategies for successful LLM implementation in business-critical environments.

## Enterprise LLM Architecture Patterns

### API Gateway Pattern
Centralized LLM access through a dedicated gateway:
- Unified authentication and authorization
- Rate limiting and usage monitoring
- Model routing and load balancing
- Request/response logging and analytics

### Microservices Integration
Distributed LLM capabilities across services:
- Service-specific model optimization
- Independent scaling and deployment
- Fault isolation and resilience
- Technology stack flexibility

### Event-Driven Architecture
Asynchronous LLM processing for scalability:
- Queue-based request handling
- Batch processing optimization
- Real-time and background processing
- System decoupling and reliability

## Security and Compliance Considerations

### Data Protection Strategies

**Input Sanitization:**
- Sensitive data detection and masking
- PII removal and anonymization
- Injection attack prevention
- Content filtering and validation

**Output Validation:**
- Response content screening
- Hallucination detection and mitigation
- Bias identification and correction
- Compliance verification

**Audit and Monitoring:**
- Comprehensive logging of all interactions
- Real-time security monitoring
- Compliance reporting and documentation
- Incident response and forensics

### Access Control and Authentication

**Role-Based Access Control (RBAC):**
- Granular permission management
- Context-aware access decisions
- Integration with existing identity systems
- Regular access reviews and updates

**API Security:**
- OAuth 2.0 and JWT token management
- API key rotation and management
- Rate limiting and DDoS protection
- Encryption in transit and at rest

## Performance Optimization Strategies

### Caching and Response Optimization

**Intelligent Caching:**
- Semantic similarity-based cache hits
- Context-aware cache invalidation
- Multi-level caching strategies
- Cache warming and preloading

**Response Streaming:**
- Real-time response delivery
- Improved user experience
- Reduced perceived latency
- Efficient resource utilization

### Model Selection and Optimization

**Model Right-Sizing:**
- Task-specific model selection
- Performance vs. cost optimization
- Latency requirements consideration
- Accuracy threshold balancing

**Fine-Tuning Strategies:**
- Domain-specific model adaptation
- Few-shot learning implementation
- Continuous learning and improvement
- A/B testing for model performance

## Scalability and Resource Management

### Auto-Scaling Strategies

**Demand-Based Scaling:**
- Real-time usage monitoring
- Predictive scaling based on patterns
- Cost-optimized resource allocation
- Multi-cloud deployment strategies

**Load Balancing:**
- Intelligent request routing
- Model-specific load distribution
- Health checking and failover
- Geographic distribution optimization

### Cost Management

**Usage Optimization:**
- Token usage monitoring and optimization
- Request batching and aggregation
- Model switching based on complexity
- Budget alerts and controls

**Resource Efficiency:**
- GPU utilization optimization
- Memory management strategies
- Network bandwidth optimization
- Storage cost minimization

## Governance and Quality Assurance

### Model Governance Framework

**Version Control:**
- Model versioning and rollback capabilities
- A/B testing and gradual rollouts
- Performance regression detection
- Change management processes

**Quality Monitoring:**
- Continuous performance evaluation
- Bias detection and mitigation
- Output quality assessment
- User feedback integration

### Compliance and Risk Management

**Regulatory Compliance:**
- GDPR, CCPA, and industry-specific requirements
- Data residency and sovereignty
- Right to explanation and transparency
- Regular compliance audits

**Risk Mitigation:**
- Fallback mechanisms for model failures
- Human oversight and intervention
- Error handling and recovery
- Business continuity planning

## Implementation Roadmap

### Phase 1: Foundation (Months 1-2)
- Infrastructure setup and security configuration
- Basic LLM integration and testing
- Initial use case implementation
- Team training and capability building

### Phase 2: Expansion (Months 3-6)
- Additional use case development
- Performance optimization and scaling
- Advanced security implementation
- Monitoring and analytics deployment

### Phase 3: Optimization (Months 6-12)
- Fine-tuning and customization
- Advanced features and capabilities
- Cross-functional integration
- Continuous improvement processes

## Success Metrics and KPIs

**Technical Metrics:**
- Response time and throughput
- Model accuracy and reliability
- System availability and uptime
- Resource utilization efficiency

**Business Metrics:**
- User adoption and engagement
- Process efficiency improvements
- Cost savings and ROI
- Customer satisfaction scores

At Vyoniq, we bring deep expertise in enterprise LLM integration, helping organizations navigate the complexities of implementing AI at scale while maintaining security, compliance, and performance standards.
    ', '/llms.jpeg', '2025-05-03 07:00:00', 10, false, 'rgba(239, 68, 68, 0.4)', true, 'cmcdwvy800000rq02usmp8q8l', '2025-06-26 21:45:02.213', '2025-06-26 21:45:02.213');
INSERT INTO public."BlogPost" VALUES ('cmcdww2nl000jrq027bc748ok', 'ai-development-tools-ecosystem', 'The Modern AI Development Tools Ecosystem', 'Explore the rapidly evolving landscape of AI development tools, from code editors to deployment platforms, and how they''re shaping the future of software development.', '
# The Modern AI Development Tools Ecosystem

The AI development tools landscape is evolving at breakneck speed, with new platforms, frameworks, and utilities emerging regularly. Understanding this ecosystem is crucial for developers and organizations looking to leverage AI effectively in their development workflows.

## Code Editors and IDEs

### AI-Powered Code Editors

**Cursor:**
- Built-from-scratch AI-first editor
- Deep codebase understanding
- Natural language programming
- Intelligent refactoring and debugging

**GitHub Copilot Integration:**
- VS Code and JetBrains support
- Context-aware code completion
- Multi-language support
- Team collaboration features

**Replit AI:**
- Browser-based development environment
- Real-time collaboration
- Integrated deployment pipeline
- Educational and prototyping focus

### Specialized AI Development Environments

**Jupyter Notebooks with AI Extensions:**
- Interactive development and experimentation
- Rich visualization capabilities
- Seamless integration with ML libraries
- Collaborative research and development

**Google Colab and AI Platform:**
- Cloud-based development environment
- GPU/TPU access for model training
- Integration with Google Cloud services
- Free tier for experimentation

## LLM Integration Platforms

### API Management and Orchestration

**LangChain:**
- Comprehensive framework for LLM applications
- Chain-of-thought reasoning implementation
- Memory and context management
- Tool integration and agent development

**LlamaIndex:**
- Data ingestion and indexing for LLMs
- Retrieval-augmented generation (RAG)
- Knowledge base integration
- Query optimization and routing

**Haystack:**
- End-to-end NLP framework
- Document processing and search
- Question answering systems
- Production-ready deployment

### Model Serving and Deployment

**Hugging Face Hub:**
- Model repository and sharing
- Inference API and endpoints
- Fine-tuning and training services
- Community collaboration platform

**OpenAI API:**
- GPT model access and integration
- Function calling capabilities
- Fine-tuning and customization
- Enterprise-grade reliability

**Anthropic Claude API:**
- Constitutional AI approach
- Long context window support
- Safety-focused design
- Research and commercial applications

## Development Frameworks and Libraries

### Agent Development Frameworks

**AutoGPT:**
- Autonomous task execution
- Goal-oriented planning
- Multi-step reasoning
- Tool integration capabilities

**LangGraph:**
- Graph-based agent workflows
- State management and persistence
- Complex reasoning patterns
- Debugging and visualization

**CrewAI:**
- Multi-agent collaboration
- Role-based agent design
- Task delegation and coordination
- Business process automation

### Prompt Engineering Tools

**PromptLayer:**
- Prompt version control and management
- A/B testing for prompts
- Performance analytics
- Team collaboration features

**Weights & Biases Prompts:**
- Experiment tracking for prompts
- Performance comparison and optimization
- Integration with ML workflows
- Visualization and reporting

## Testing and Quality Assurance

### AI-Specific Testing Tools

**DeepEval:**
- LLM evaluation and benchmarking
- Custom metric development
- Regression testing for AI models
- Performance monitoring

**Promptfoo:**
- Prompt testing and validation
- Automated evaluation pipelines
- Security and safety testing
- Integration with CI/CD workflows

### Monitoring and Observability

**LangSmith:**
- LLM application monitoring
- Trace analysis and debugging
- Performance optimization insights
- Production deployment support

**Arize AI:**
- Model performance monitoring
- Drift detection and alerting
- Explainability and interpretability
- Root cause analysis

## Deployment and Infrastructure

### Cloud Platforms

**Vercel AI SDK:**
- Full-stack AI application development
- Edge runtime optimization
- Streaming and real-time capabilities
- Serverless deployment model

**AWS Bedrock:**
- Managed foundation model service
- Multi-model support and switching
- Enterprise security and compliance
- Integration with AWS ecosystem

**Google Cloud Vertex AI:**
- End-to-end ML platform
- Model training and deployment
- AutoML capabilities
- Enterprise-grade infrastructure

### Container and Orchestration

**Docker and Kubernetes:**
- Containerized AI application deployment
- Scalable and resilient infrastructure
- Resource management and optimization
- Multi-cloud deployment strategies

**Ray:**
- Distributed computing for AI workloads
- Scalable model training and serving
- Hyperparameter tuning
- Reinforcement learning support

## Emerging Tools and Trends

### No-Code/Low-Code AI Platforms

**Zapier AI:**
- Workflow automation with AI
- Natural language task creation
- Integration with business applications
- Non-technical user accessibility

**Microsoft Power Platform AI:**
- Business application development
- AI Builder for custom models
- Integration with Office 365
- Citizen developer empowerment

### Specialized Development Tools

**Cursor Composer:**
- Multi-file editing with AI
- Large-scale refactoring
- Architecture-level changes
- Codebase transformation

**Aider:**
- Command-line AI coding assistant
- Git integration and version control
- Pair programming with AI
- Terminal-based workflow

## Choosing the Right Tools

### Evaluation Criteria

**Development Stage:**
- Prototyping vs. production requirements
- Team size and expertise level
- Integration complexity needs
- Performance and scalability requirements

**Technical Requirements:**
- Programming language support
- Framework compatibility
- Deployment environment constraints
- Security and compliance needs

**Business Considerations:**
- Cost and licensing models
- Vendor lock-in concerns
- Support and community resources
- Long-term viability and roadmap

At Vyoniq, we stay at the forefront of the AI development tools ecosystem, helping our clients select and implement the most appropriate tools for their specific needs and objectives. Our expertise spans the entire toolchain, from development to deployment and monitoring.
    ', '/llms.jpeg', '2025-04-22 07:00:00', 8, true, 'rgba(249, 115, 22, 0.4)', true, 'cmcdwvy800000rq02usmp8q8l', '2025-06-26 21:45:02.578', '2025-06-26 21:45:02.578');
INSERT INTO public."BlogPost" VALUES ('cmce9396n0001rq4h5xh0eyt0', 'building-a-production-ready-mcp-server-with-nextjs-a-complete-implementation-guide', 'Building a Production-Ready MCP Server with Next.js: A Complete Implementation Guide', 'Learn how to build a robust Model Context Protocol (MCP) server using Next.js without Vercel deployment. This comprehensive guide covers everything from schema design to authentication, based on real-world implementation experience with the Vyoniq MCP server.', '# Building a Production-Ready MCP Server with Next.js: A Complete Implementation Guide

The Model Context Protocol (MCP) is revolutionizing how Large Language Models interact with external systems and data sources. While many tutorials focus on simple implementations, building a production-ready MCP server requires careful attention to schema design, authentication, error handling, and client compatibility.

This guide walks you through building a complete MCP server using Next.js, based on our experience developing the Vyoniq MCP server that successfully integrates with Cursor IDE and other MCP clients.

## Why Next.js for MCP Servers?

Next.js provides an excellent foundation for MCP servers due to its:

- **API Routes**: Built-in support for serverless functions and API endpoints
- **TypeScript Integration**: First-class TypeScript support for type safety
- **Middleware Support**: Request/response processing and authentication
- **Flexible Deployment**: Works with any hosting provider, not just Vercel
- **Performance**: Optimized for production workloads

## Project Architecture Overview

Our MCP server follows a modular architecture that separates concerns and maintains scalability:

```
lib/mcp/
├── server.ts          # Core MCP server implementation
├── init.ts           # Server initialization and tool registration
├── types.ts          # Zod schemas and TypeScript interfaces
├── tools/            # Individual tool implementations
│   ├── blog.ts       # Blog management tools
│   └── analytics.ts  # Analytics tools
└── resources/        # Dynamic resource handlers
    └── blog.ts       # Blog resource providers
```

This structure ensures clean separation of concerns and makes it easy to add new tools and resources as your MCP server grows.

## The Critical Schema Design Pattern

The most important aspect of MCP server implementation is proper schema design. Many implementations fail because they don''t provide proper parameter descriptions that MCP clients like Cursor need to display helpful information.

### ❌ Common Mistake: Raw Schemas Without Descriptions

```typescript
// This won''t show parameter descriptions in Cursor
const BadSchema = z.object({
  title: z.string().min(1),
  published: z.boolean().optional()
});
```

### ✅ Correct Implementation: Always Use .describe()

```typescript
// This will show proper descriptions in Cursor
const GoodSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .describe("The title of the blog post"),
  published: z.boolean()
    .optional()
    .describe("Filter posts by published status (true for published, false for drafts, omit for all posts)")
});
```

## Schema Conversion for MCP Clients

The key to Cursor compatibility is proper JSON Schema generation:

```typescript
import { zodToJsonSchema } from "zod-to-json-schema";

export interface MCPTool {
  name: string;
  description?: string;
  inputSchema: any; // JSON Schema for MCP clients
  zodSchema?: z.ZodSchema; // Zod schema for server validation
}

const createBlogPostTool: MCPTool = {
  name: "create_blog_post",
  description: "Create a new blog post with specified content, categories, and metadata",
  // Convert to JSON Schema for MCP clients (like Cursor)
  inputSchema: zodToJsonSchema(CreateBlogPostSchema, { 
    $refStrategy: "none" // Critical: Use inline schemas, not $ref
  }),
  // Keep Zod schema for server-side validation
  zodSchema: CreateBlogPostSchema,
};
```

The `$refStrategy: "none"` parameter is crucial - it ensures that complex schema references don''t confuse MCP clients.

## Implementing Dual Authentication

Production MCP servers need to support both API key authentication (for external clients like Cursor) and session-based authentication (for web UIs):

```typescript
export async function authenticateRequest(
  request: NextRequest
): Promise<MCPAuthContext | null> {
  // 1. Check for API key first (for external MCP clients)
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return await authenticateApiKey(authHeader.replace("Bearer ", ""));
  }

  // 2. Fall back to Clerk session (for web UI)
  return await authenticateClerkSession(request);
}
```

### Secure API Key Management

Store API keys securely using bcrypt hashing:

```typescript
// API Key Format: vyoniq_sk_<64_hex_characters>
const API_KEY_PREFIX = "vyoniq_sk_";
const API_KEY_LENGTH = 64;

// Store hashed keys in database
const hashedKey = await bcrypt.hash(rawKey, 12);

// Validate keys
const isValid = await bcrypt.compare(providedKey, storedHashedKey);
```

## Tool Implementation Pattern

Each MCP tool should follow a consistent pattern for reliability and maintainability:

```typescript
export const createBlogPostTool: MCPTool = {
  name: "create_blog_post",
  description: "Create a new blog post with specified content, categories, and metadata",
  inputSchema: zodToJsonSchema(CreateBlogPostSchema, { $refStrategy: "none" }),
  zodSchema: CreateBlogPostSchema,
};

export async function createBlogPostHandler(
  args: unknown,
  auth: MCPAuthContext
): Promise<MCPToolResult> {
  try {
    // 1. Validate permissions
    if (!auth.isAdmin) {
      return createErrorResponse("Unauthorized: Admin access required");
    }

    // 2. Validate and parse arguments using Zod schema
    const data = CreateBlogPostSchema.parse(args);

    // 3. Perform business logic
    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        authorId: auth.userId,
      },
    });

    // 4. Return structured success response
    return createSuccessResponse(
      `Successfully created blog post: "${post.title}" (ID: ${post.id})`
    );
  } catch (error) {
    console.error("Error creating blog post:", error);
    return createErrorResponse(
      `Failed to create blog post: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
```

## JSON-RPC Protocol Implementation

MCP uses JSON-RPC 2.0 protocol. Your server must handle the protocol correctly:

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate JSON-RPC format
    if (body.jsonrpc !== "2.0") {
      return createErrorResponse(MCP_ERRORS.INVALID_REQUEST, "Invalid JSON-RPC version");
    }

    // Route to appropriate handler
    switch (body.method) {
      case "initialize":
        return handleInitialize(body);
      case "tools/list":
        return await handleToolsList(body, request);
      case "tools/call":
        return await handleToolsCall(body, request);
      case "resources/list":
        return await handleResourcesList(body, request);
      case "resources/read":
        return await handleResourcesRead(body, request);
      default:
        return createErrorResponse(MCP_ERRORS.METHOD_NOT_FOUND, `Method not found: ${body.method}`);
    }
  } catch (error) {
    console.error("MCP Server Error:", error);
    return createErrorResponse(MCP_ERRORS.INTERNAL_ERROR, "Internal server error");
  }
}
```

## Server Initialization and Tool Registration

Proper server initialization is crucial for reliability:

```typescript
export function initializeMCPServer() {
  console.log("Initializing Vyoniq MCP Server...");

  // Register blog management tools
  mcpServer.addTool(createBlogPostTool, createBlogPostHandler);
  mcpServer.addTool(updateBlogPostTool, updateBlogPostHandler);
  mcpServer.addTool(publishBlogPostTool, publishBlogPostHandler);
  mcpServer.addTool(deleteBlogPostTool, deleteBlogPostHandler);
  mcpServer.addTool(createCategoryTool, createCategoryHandler);
  mcpServer.addTool(listBlogPostsTool, listBlogPostsHandler);
  mcpServer.addTool(listCategoriesTool, listCategoriesHandler);
  mcpServer.addTool(getBlogPostTool, getBlogPostHandler);

  console.log(`✅ Vyoniq MCP Server initialized successfully`);
  console.log(`📊 Registered ${mcpServer.listTools().length} tools`);
}
```

## Testing Your MCP Server

Create comprehensive tests to ensure your server works correctly:

```typescript
async function testMCPServer() {
  const baseUrl = ''http://localhost:3000/api/mcp'';
  const apiKey = ''your_api_key_here'';

  // Test 1: Initialize
  const initResponse = await fetch(baseUrl, {
    method: ''POST'',
    headers: {
      ''Content-Type'': ''application/json'',
      ''Authorization'': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      jsonrpc: ''2.0'',
      id: 1,
      method: ''initialize'',
      params: {
        protocolVersion: ''2024-11-05'',
        capabilities: {},
        clientInfo: { name: ''test-client'', version: ''1.0.0'' }
      }
    })
  });

  // Test 2: List tools
  const toolsResponse = await fetch(baseUrl, {
    method: ''POST'',
    headers: {
      ''Content-Type'': ''application/json'',
      ''Authorization'': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      jsonrpc: ''2.0'',
      id: 2,
      method: ''tools/list''
    })
  });

  // Validate responses
  console.log(''Initialize:'', await initResponse.json());
  console.log(''Tools:'', await toolsResponse.json());
}
```

## Deployment Without Vercel

While Vercel is popular for Next.js deployment, you can deploy your MCP server anywhere:

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
CLERK_SECRET_KEY="sk_..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."

# MCP Server
MCP_SERVER_PORT=3000
MCP_API_KEY_SALT_ROUNDS=12
```

### Reverse Proxy Configuration (Nginx)

```nginx
server {
    listen 80;
    server_name your-mcp-server.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection ''upgrade'';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Common Pitfalls and Solutions

### 1. Missing Parameter Descriptions
**Problem**: Cursor shows tools but no parameter descriptions
**Solution**: Always use `.describe()` on every Zod schema field

### 2. Complex Schema References
**Problem**: $ref-based schemas confuse MCP clients
**Solution**: Use `{ $refStrategy: "none" }` in `zodToJsonSchema()`

### 3. Authentication Issues
**Problem**: API key validation fails
**Solution**: Use `bcrypt.compare()` for hashed key validation

### 4. Tool Registration Errors
**Problem**: Tools not appearing in clients
**Solution**: Ensure proper tool registration in server initialization

## Production Deployment Checklist

Before deploying your MCP server:

- [ ] All tools have parameter descriptions
- [ ] Schema conversion uses inline schemas (`$refStrategy: "none"`)
- [ ] Authentication is properly implemented
- [ ] JSON-RPC protocol is correctly handled
- [ ] Error responses are structured properly
- [ ] API keys are securely generated and stored
- [ ] All tools are registered in server initialization
- [ ] Comprehensive test suite passes
- [ ] Environment variables are configured
- [ ] Database migrations are applied
- [ ] Monitoring and logging are set up

## Real-World Results

Our Vyoniq MCP server implementation successfully:

- **Integrates with Cursor IDE**: All 8 tools work seamlessly with proper parameter descriptions
- **Handles Authentication**: Dual authentication supports both API keys and web sessions
- **Manages Blog Content**: Complete CRUD operations for blog posts and categories
- **Provides Resources**: Dynamic resource templates for flexible data access
- **Scales Reliably**: Handles concurrent requests and maintains performance

## Conclusion

Building a production-ready MCP server with Next.js requires attention to detail, especially around schema design and authentication. The patterns and practices outlined in this guide will help you create robust MCP servers that integrate seamlessly with Cursor and other MCP clients.

The key to success is following the established patterns for schema design, implementing proper authentication, and thoroughly testing your implementation. With these foundations in place, you can build powerful MCP servers that unlock new possibilities for LLM integration in your applications.

At Vyoniq, we''ve successfully implemented these patterns to create a fully functional MCP server that enhances our development workflow and provides seamless integration with modern AI development tools. The investment in proper MCP server implementation pays dividends in developer productivity and system reliability.', '/llms.jpeg', '2025-06-27 03:26:33.02', 12, true, 'rgba(59, 130, 246, 0.4)', true, 'cmcdwvy800000rq02usmp8q8l', '2025-06-27 03:26:33.023', '2025-06-27 03:26:33.023');


--
-- Data for Name: BlogPostCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."BlogPostCategory" VALUES ('cmcdww12x000brq028ueh8yut', 'cmcdwvyc30001rq02dh0ctac3');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww12x000brq028ueh8yut', 'cmcdwvysh0002rq028vyzi2dk');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww12x000brq028ueh8yut', 'cmcdwvz2c0003rq02nagpr1hf');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww1p6000drq02w55ae3ni', 'cmcdwvzde0004rq02ihx2aqrx');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww1p6000drq02w55ae3ni', 'cmcdwvzoa0005rq02hi0fx3vs');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww1p6000drq02w55ae3ni', 'cmcdwvzy50006rq02osjux56m');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww21s000frq02cwt2kvml', 'cmcdww08h0007rq023w6eydu7');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww21s000frq02cwt2kvml', 'cmcdww0ig0008rq02qawnmxwx');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww21s000frq02cwt2kvml', 'cmcdwvzoa0005rq02hi0fx3vs');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww2dg000hrq021e3na4b6', 'cmcdwvzoa0005rq02hi0fx3vs');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww2dg000hrq021e3na4b6', 'cmcdww0sd0009rq025hasoq3c');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww2dg000hrq021e3na4b6', 'cmcdwvz2c0003rq02nagpr1hf');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww2nl000jrq027bc748ok', 'cmcdwvysh0002rq028vyzi2dk');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww2nl000jrq027bc748ok', 'cmcdwvyc30001rq02dh0ctac3');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww2nl000jrq027bc748ok', 'cmcdwvz2c0003rq02nagpr1hf');


--
-- Data for Name: Inquiry; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Inquiry" VALUES ('cmch73df00000rqnmat45gp4n', 'Test User', 'javier@vyoniq.com', 'Web & Mobile App Development', 'This is a test inquiry to check the email system.', '2025-06-29 04:53:57.804', 'IN_PROGRESS', '2025-06-29 04:57:27.857', NULL);
INSERT INTO public."Inquiry" VALUES ('cmch7k62s0000rqm51t2p3m1w', 'Test User 3', 'javier@vyoniq.com', 'AI Integrations', 'Testing inquiry system after fixing the params issue.', '2025-06-29 05:07:01.443', 'PENDING', '2025-06-29 05:07:01.443', NULL);
INSERT INTO public."Inquiry" VALUES ('cmch7ss850003rqm5ybup2ogb', 'Debug Test', 'javier@vyoniq.com', 'Web & Mobile App Development', 'Testing with detailed logging to debug email issue.', '2025-06-29 05:13:42.629', 'PENDING', '2025-06-29 05:13:42.629', NULL);
INSERT INTO public."Inquiry" VALUES ('cmch7tk1l0000rqxke8ua2mpq', 'Debug Test 2', 'javier@vyoniq.com', 'AI Integrations', 'Testing again with fresh server logs.', '2025-06-29 05:14:19.45', 'PENDING', '2025-06-29 05:14:19.45', NULL);
INSERT INTO public."Inquiry" VALUES ('cmch7ui5l0003rqxk46n7h4ci', 'Final Test', 'javier@vyoniq.com', 'Hosting Services', 'Testing with verified Resend domain to ensure email delivery.', '2025-06-29 05:15:03.584', 'PENDING', '2025-06-29 05:15:03.584', NULL);
INSERT INTO public."Inquiry" VALUES ('cmch7zb1e0006rqxkdg41tgde', 'JavierTesting', 'jgongora@gmail.com', 'hosting', 'I want hosting sercvices.', '2025-06-29 05:18:47.645', 'PENDING', '2025-06-29 06:00:26.861', 'user_2yQbLBJukarNLRkMZ4okDc84wLh');
INSERT INTO public."Inquiry" VALUES ('cmch86qqo0009rqxkdgv7tj4m', 'AnotherUserText', 'jgongora@gmail.com', 'vyoniq-apps', 'I want more info about vyoniq apps.', '2025-06-29 05:24:34.083', 'IN_PROGRESS', '2025-07-04 03:47:34.624', 'user_2yQbLBJukarNLRkMZ4okDc84wLh');


--
-- Data for Name: Budget; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Budget" VALUES ('cmco6hc430001rqzlfgm25ezp', 'cmch86qqo0009rqxkdgv7tj4m', 'Vyoniq App Budget Test', 'Vyoniq App Budget Test', 550.00, 'USD', 'PAID', '2025-07-31 00:00:00', '', '', 'user_2yQbLBJukarNLRkMZ4okDc84wLh', '2025-07-04 02:11:12.915', '2025-07-04 03:47:33.88');


--
-- Data for Name: ServicePricing; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: BudgetItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."BudgetItem" VALUES ('cmco6hc430002rqzldmy0ix21', 'cmco6hc430001rqzlfgm25ezp', NULL, 'Website', '', 1, 550.00, 550.00, true, 'development', '2025-07-04 02:11:12.915');


--
-- Data for Name: InquiryMessage; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."InquiryMessage" VALUES ('cmch73djo0002rqnml21vnead', 'cmch73df00000rqnmat45gp4n', 'This is a test inquiry to check the email system.', false, NULL, '2025-06-29 04:53:57.972');
INSERT INTO public."InquiryMessage" VALUES ('cmch77vcb0001rqjjx3ohnt5n', 'cmch73df00000rqnmat45gp4n', 'Test response from Vyoniq platform.', true, 'user_2yQbLBJukarNLRkMZ4okDc84wLh', '2025-06-29 04:57:27.659');
INSERT INTO public."InquiryMessage" VALUES ('cmch7k69t0002rqm56rvkabcb', 'cmch7k62s0000rqm51t2p3m1w', 'Testing inquiry system after fixing the params issue.', false, NULL, '2025-06-29 05:07:01.696');
INSERT INTO public."InquiryMessage" VALUES ('cmch7ssdg0005rqm54umkuzzx', 'cmch7ss850003rqm5ybup2ogb', 'Testing with detailed logging to debug email issue.', false, NULL, '2025-06-29 05:13:43.588');
INSERT INTO public."InquiryMessage" VALUES ('cmch7tk5s0002rqxkghw4rjl1', 'cmch7tk1l0000rqxke8ua2mpq', 'Testing again with fresh server logs.', false, NULL, '2025-06-29 05:14:19.6');
INSERT INTO public."InquiryMessage" VALUES ('cmch7ui7k0005rqxk38aa80tq', 'cmch7ui5l0003rqxk46n7h4ci', 'Testing with verified Resend domain to ensure email delivery.', false, NULL, '2025-06-29 05:15:03.728');
INSERT INTO public."InquiryMessage" VALUES ('cmch7zb3d0008rqxkurncai4w', 'cmch7zb1e0006rqxkdg41tgde', 'I want hosting sercvices.', false, NULL, '2025-06-29 05:18:47.785');
INSERT INTO public."InquiryMessage" VALUES ('cmch86qur000brqxk9yzwl7y0', 'cmch86qqo0009rqxkdgv7tj4m', 'I want more info about vyoniq apps.', false, NULL, '2025-06-29 05:24:34.803');
INSERT INTO public."InquiryMessage" VALUES ('cmch9ihcm0001rqvcx9een8p0', 'cmch86qqo0009rqxkdgv7tj4m', 'Hi, I will provide more info about vyoniq apps.', true, 'user_2yQbLBJukarNLRkMZ4okDc84wLh', '2025-06-29 06:01:41.974');


--
-- Data for Name: Newsletter; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Payment" VALUES ('cmco892u60001rq035paw3son', 'cmco6hc430001rqzlfgm25ezp', NULL, 'cs_test_a1NEJf1YG7YWgiWtEdtFQpqaQKGTDyLDSbyUycXvQPodmE0le2diCnYWJ9', 550.00, 'USD', 'PENDING', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-04 03:00:46.877', '2025-07-04 03:00:46.877');
INSERT INTO public."Payment" VALUES ('cmco9wej30001rq95fzesgizq', 'cmco6hc430001rqzlfgm25ezp', 'pi_3Rh0b1PeTGX8Odpe0O03tgn0', 'cs_test_a1udo8HeovLwnEzE68fQxcq0OhxMor2XJV8OEKTxjZ8SECwEdBGdAiU2FS', 550.00, 'USD', 'SUCCEEDED', 'card', '2025-07-04 03:47:33.217', NULL, NULL, NULL, NULL, '{"id": "cs_test_a1udo8HeovLwnEzE68fQxcq0OhxMor2XJV8OEKTxjZ8SECwEdBGdAiU2FS", "url": null, "mode": "payment", "locale": null, "object": "checkout.session", "status": "complete", "consent": null, "created": 1751600814, "invoice": null, "ui_mode": "hosted", "currency": "usd", "customer": null, "livemode": false, "metadata": {"userId": "user_2yQbLBJukarNLRkMZ4okDc84wLh", "budgetId": "cmco6hc430001rqzlfgm25ezp", "inquiryId": "cmch86qqo0009rqxkdgv7tj4m"}, "discounts": [], "cancel_url": "http://localhost:3000/dashboard/budgets/cmco6hc430001rqzlfgm25ezp", "expires_at": 1751687214, "custom_text": {"submit": null, "after_submit": null, "shipping_address": null, "terms_of_service_acceptance": null}, "permissions": null, "submit_type": null, "success_url": "http://localhost:3000/dashboard/payments/success?session_id={CHECKOUT_SESSION_ID}", "amount_total": 55000, "payment_link": null, "setup_intent": null, "subscription": null, "automatic_tax": {"status": null, "enabled": false, "provider": null, "liability": null}, "client_secret": null, "custom_fields": [], "shipping_cost": null, "total_details": {"amount_tax": 0, "amount_discount": 0, "amount_shipping": 0}, "customer_email": "jgongora@gmail.com", "origin_context": null, "payment_intent": "pi_3Rh0b1PeTGX8Odpe0O03tgn0", "payment_status": "paid", "recovered_from": null, "wallet_options": null, "amount_subtotal": 55000, "adaptive_pricing": {"enabled": true}, "after_expiration": null, "customer_details": {"name": "424242424242", "email": "jgongora@gmail.com", "phone": null, "address": {"city": "424242", "line1": "424242", "line2": "424242422", "state": "KY", "country": "US", "postal_code": "42424"}, "tax_ids": [], "tax_exempt": "none"}, "invoice_creation": {"enabled": false, "invoice_data": {"footer": null, "issuer": null, "metadata": {}, "description": null, "custom_fields": null, "account_tax_ids": null, "rendering_options": null}}, "shipping_options": [], "customer_creation": "if_required", "consent_collection": null, "client_reference_id": null, "currency_conversion": null, "payment_method_types": ["card"], "allow_promotion_codes": null, "collected_information": {"shipping_details": {"name": "424242424242", "address": {"city": "424242", "line1": "424242", "line2": "424242422", "state": "KY", "country": "US", "postal_code": "42424"}}}, "payment_method_options": {"card": {"request_three_d_secure": "automatic"}}, "phone_number_collection": {"enabled": false}, "payment_method_collection": "if_required", "billing_address_collection": "required", "shipping_address_collection": {"allowed_countries": ["US", "CA", "GB", "AU", "DE", "FR", "ES", "IT"]}, "saved_payment_method_options": null, "payment_method_configuration_details": null}', '2025-07-04 03:46:54.734', '2025-07-04 03:47:33.219');


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public._prisma_migrations VALUES ('75a24d4d-9133-4cd5-a732-23aa1fe92748', '71ff0f569f6301bd654a86512548eab34452e7f9026b2382e9fe3154fa005011', '2025-07-04 02:35:01.263795+00', '20250703193433_baseline', '', NULL, '2025-07-04 02:35:01.263795+00', 0);


--
-- PostgreSQL database dump complete
--

