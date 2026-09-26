export interface JobListing {
  id: string;
  title: string;
  department: string;
  location?: string;
  type?: string;
  experience?: string;
  description: string;
  responsibilities: string[];
  applicationNote: string;
  requirements: string[];
}

export const careers: JobListing[] = [
  {
    id: "full-stack-developer-intern",
    title: "Full Stack Developer Intern",
    department: "Engineering",
    type: "Internship",
    description:
      "Build complete web applications, from responsive React and Next.js interfaces to the APIs and databases behind them. We are looking for someone who has already built working projects and can explain how the frontend, backend, authentication and deployment fit together. You will contribute to Aletheia AI products and client websites, with an emphasis on maintainable code, thoughtful interactions and reliable functionality.",
    responsibilities: [
      "Build responsive interfaces in React and Next.js using JavaScript or TypeScript, reusable components and accessible HTML/CSS.",
      "Implement application routes, forms, validation, loading states and error handling; choose appropriate client-side and server-side rendering approaches.",
      "Develop and integrate backend APIs using Node.js or Python, including authentication, authorisation and third-party services.",
      "Work with relational or document databases: design basic schemas, write queries and connect application data to the interface.",
      "Debug issues across the stack, write useful tests and submit focused changes through Git and code review.",
      "Help deploy applications, manage environment configuration and check responsiveness, performance and functionality before release.",
    ],
    requirements: [
      "Hands-on experience building projects with React and Next.js; HTML, CSS and JavaScript fundamentals are expected.",
      "Understanding of component state, hooks, routing, asynchronous requests and the boundary between browser and server code.",
      "Ability to build or work with REST APIs and a backend framework, rather than only assemble frontend templates.",
      "Familiarity with databases such as PostgreSQL or MongoDB and with authentication and basic application security.",
      "Comfort with Git, debugging tools, package management and deploying a working application.",
      "Ability to explain your own implementation decisions and respond to review feedback. TypeScript experience is useful.",
    ],
    applicationNote:
      "Include your CV, GitHub profile and a deployed full-stack project if available. Describe its stack, the features you personally implemented, how data and authentication work, and one technical problem you solved.",
  },
  {
    id: "ai-intern",
    title: "AI Intern",
    department: "Engineering",
    type: "Internship",
    description:
      "Work on AI systems from data preparation and model experiments through evaluation and application integration. We expect practical experience training a model and fine-tuning an existing model, with an understanding of how to measure whether the result improves. You will help develop task-specific models and AI features, document experiments and turn promising prototypes into reproducible software.",
    responsibilities: [
      "Prepare and clean datasets, define train/validation/test splits and investigate quality issues or data leakage.",
      "Train baseline models and fine-tune pretrained models for a defined task; compare results against the baseline.",
      "Run experiments with hyperparameters, learning rates and training configurations, tracking metrics and saving reproducible checkpoints.",
      "Evaluate model quality using task-appropriate metrics, inspect failure cases and identify overfitting or inconsistent outputs.",
      "Build supporting AI features such as retrieval pipelines or model-backed APIs, and test their behaviour with realistic inputs.",
      "Document data choices, training steps, evaluation results and inference requirements so another engineer can reproduce your work.",
    ],
    requirements: [
      "Strong working knowledge of Python, including data handling with tools such as NumPy and pandas.",
      "Hands-on experience training at least one model and fine-tuning a pretrained model; coursework or personal projects are acceptable if you can explain the work.",
      "Practical familiarity with PyTorch or TensorFlow and common pretrained-model tooling such as Hugging Face.",
      "Understanding of loss functions, optimisation, batching, validation, overfitting and appropriate evaluation metrics.",
      "Ability to work with training scripts or notebooks, manage dependencies and use Git to keep experiments reproducible.",
      "Exposure to GPU training, parameter-efficient fine-tuning such as LoRA, or model serving is useful; explain the techniques you have actually used.",
    ],
    applicationNote:
      "Share your CV and a repository or notebook showing model training and fine-tuning. Include the task, dataset, base model, your contribution, evaluation metrics and a short explanation of what improved or failed.",
  },
  {
    id: "rust-ruby-intern",
    title: "Rust/Ruby Intern",
    department: "Engineering",
    type: "Internship",
    experience: "2–3 years of relevant experience",
    description:
      "Build backend services, integrations and developer tools using Rust or Ruby. This opening expects 2–3 years of hands-on experience in at least one of these languages and the ability to contribute beyond introductory exercises. You will work on implementation, testing and debugging, with attention to reliable behaviour, clear interfaces and code that the team can maintain.",
    responsibilities: [
      "Implement backend features, command-line tools or integrations in the language you specialise in: Rust or Ruby.",
      "Design and consume APIs, validate inputs and handle failures, retries and edge cases explicitly.",
      "For Rust work, apply ownership, borrowing and error-handling patterns; for Ruby work, build maintainable application or service code using the relevant framework.",
      "Connect services to databases or external systems and investigate performance, correctness and reliability issues.",
      "Write automated tests, review changes with the team and improve existing code without breaking its behaviour.",
      "Document setup, usage and implementation decisions, and support the preparation of changes for release.",
    ],
    requirements: [
      "2–3 years of relevant hands-on experience with Rust or Ruby. Strong experience in either language is sufficient; both are not required.",
      "For Rust: familiarity with ownership and borrowing, Cargo, error handling and testing; async or concurrency experience is useful.",
      "For Ruby: familiarity with idiomatic Ruby, dependency management, automated testing and Rails or another relevant backend framework.",
      "Experience working with APIs, databases and debugging beyond standalone tutorial projects.",
      "Comfort with Git, code review, testable design and reading an existing codebase.",
      "Ability to describe projects you have maintained, your individual contribution and the trade-offs behind your code.",
    ],
    applicationNote:
      "State whether you are applying with Rust or Ruby and summarise your 2–3 years of relevant experience. Include a CV and code samples or repositories, with a short description of the services or tools you built.",
  },
  {
    id: "ui-ux-designer",
    title: "UI/UX Designer",
    department: "Design",
    experience: "2–3 years of relevant experience",
    description:
      "Design usable, visually considered websites and digital products, from early user flows to developer-ready interfaces. We are looking for 2–3 years of UI/UX design experience and strong hands-on Figma skills. You should be able to explain the thinking behind your work, design complete interaction states and collaborate with engineers to carry the design through implementation.",
    responsibilities: [
      "Translate product requirements and user needs into information architecture, task flows and wireframes.",
      "Design responsive interfaces in Figma, covering desktop and mobile layouts as well as loading, empty, error and success states.",
      "Build and maintain components, variants, styles and reusable patterns with Figma Auto Layout.",
      "Create interactive prototypes to communicate behaviour and refine them using feedback or usability findings.",
      "Prepare clear developer handoffs, including spacing, typography, assets and interaction specifications.",
      "Review implemented screens with engineers and resolve usability, accessibility and visual consistency issues.",
    ],
    requirements: [
      "2–3 years of relevant UI/UX or product design experience, supported by a portfolio of completed work.",
      "Strong Figma skills: Auto Layout, components, variants, prototyping and organised design files.",
      "Understanding of responsive design, visual hierarchy, typography, spacing and interaction design.",
      "Ability to explain user flows and design decisions, including how constraints or feedback changed the result.",
      "Familiarity with accessibility considerations and with producing consistent interface states.",
      "Experience collaborating with developers and checking that the built product reflects the intended design.",
    ],
    applicationNote:
      "Include your CV, portfolio and two detailed case studies. For each, show the problem, your role, key flows, Figma work and final solution. Explain your decisions and any feedback or outcomes you can substantiate.",
  },
  {
    id: "graphic-designer",
    title: "Graphic Designer",
    department: "Design",
    experience: "2–3 years of relevant experience",
    description:
      "Create cohesive visual work for Aletheia AI and its client projects across brand identity, campaigns, social media, presentations and company collateral. This role expects 2–3 years of graphic design experience and confidence working in Figma alongside suitable vector or image-editing tools. You should bring strong fundamentals and the ability to develop an idea into a consistent set of finished assets.",
    responsibilities: [
      "Develop concepts and layouts for brand assets, social campaigns, website graphics, brochures and presentations.",
      "Use typography, colour, composition and imagery to communicate a clear message within the brand system.",
      "Create reusable Figma templates and organised asset libraries for recurring content and campaign formats.",
      "Adapt designs across digital and print sizes while preserving hierarchy, readability and visual consistency.",
      "Present design directions, explain your choices and refine the work through feedback.",
      "Prepare clean source files and production-ready exports with appropriate dimensions, formats and print specifications.",
    ],
    requirements: [
      "2–3 years of relevant graphic or visual design experience, with a portfolio that shows your own contribution.",
      "Hands-on Figma proficiency for layouts, reusable templates, asset organisation and collaborative review.",
      "Confidence with vector or image-editing tools such as Illustrator, Photoshop or equivalent tools appropriate to your work.",
      "Strong typography, colour, layout and composition skills across more than one content format.",
      "Ability to follow and extend a brand system, rather than rely on unrelated templates for each asset.",
      "Understanding of digital export requirements and print basics, including resolution, colour modes and bleed.",
    ],
    applicationNote:
      "Share your CV and a portfolio with three to five relevant projects. Include a brand or campaign system, examples across multiple formats, and a brief explanation of the brief, your role and final deliverables.",
  },
  {
    id: "software-engineer",
    title: "Software Engineer",
    department: "Engineering",
    description:
      "Develop reliable software for Aletheia AI products and client systems, taking features from an understood requirement through implementation, testing and release. The role calls for solid engineering fundamentals and the ability to work within an existing codebase. You will collaborate across AI, backend and frontend work where needed, while keeping interfaces clear and changes easy to review and maintain.",
    responsibilities: [
      "Break product requirements into manageable technical tasks and explain the proposed approach before implementation.",
      "Build and maintain backend services, application features and third-party integrations.",
      "Design clear APIs and data models, including validation, authentication boundaries and predictable error handling.",
      "Investigate defects using logs, tests and reproducible examples; address underlying causes rather than symptoms.",
      "Write automated tests, participate in code review and improve documentation for setup, operation and maintenance.",
      "Help prepare releases, assess reliability and performance, and support changes after they reach users.",
    ],
    requirements: [
      "Practical experience developing and maintaining working software in at least one relevant programming language.",
      "Understanding of data structures, modular design, debugging and basic performance trade-offs.",
      "Experience with APIs, databases and automated tests, supported by projects you can discuss in detail.",
      "Comfort using Git, reviewing code and navigating an unfamiliar codebase.",
      "Familiarity with deployment workflows, environment configuration and diagnosing application failures.",
      "Ability to communicate trade-offs, ask useful questions and follow a feature through to a tested result.",
    ],
    applicationNote:
      "Include your CV, GitHub profile or other code samples, and one substantial project. Describe its architecture, your contribution, the tests or reliability work you completed, and an engineering trade-off you made.",
  },
];
