document.addEventListener("DOMContentLoaded", () => {
  // --- Navigation Highlights & Scroll Background ---
  const header = document.getElementById("navbar");
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    // Add shadow to header on scroll
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Active link highlighting
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(current)) {
        link.classList.add("active");
      }
    });
  });

  // --- Mobile Menu Toggle ---
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-links");
  const resumeBtn = document.querySelector(".resume-btn");

  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("nav-active");
    if (navMenu.classList.contains("nav-active")) {
      navMenu.style.display = "flex";
    } else {
      navMenu.style.display = "none";
    }
  });

  // Close mobile menu when link clicked
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        navMenu.classList.remove("nav-active");
        navMenu.style.display = "none";
      }
    });
  });

  // Reset layout on resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      navMenu.style.display = "flex";
      navMenu.classList.remove("nav-active");
    } else if (!navMenu.classList.contains("nav-active")) {
      navMenu.style.display = "none";
    }
  });

  // --- Scroll Reveal Animations (non-timeline elements only) ---
  const reveals = document.querySelectorAll(".reveal");

  const revealOnScroll = () => {
    for (let i = 0; i < reveals.length; i++) {
      // Skip timeline items — they are handled by the checkpoint system
      if (reveals[i].classList.contains("tl-item")) continue;

      const windowHeight = window.innerHeight;
      const revealTop = reveals[i].getBoundingClientRect().top;
      const revealPoint = 100;

      if (revealTop < windowHeight - revealPoint) {
        reveals[i].classList.add("active");
        reveals[i].classList.add("visible");
      }
    }
  };

  window.addEventListener("scroll", revealOnScroll);
  setTimeout(revealOnScroll, 100);

  // --- Timeline Checkpoint System ---
  const tlLine = document.querySelector(".tl-line");
  const timeline = document.querySelector(".timeline");
  const tlItems = document.querySelectorAll(".tl-item");

  const animateTimeline = () => {
    if (!tlLine || !timeline || tlItems.length === 0) return;

    const timelineRect = timeline.getBoundingClientRect();
    const timelineTop = timelineRect.top;
    const timelineHeight = timelineRect.height;
    const windowHeight = window.innerHeight;

    // How far the viewport bottom has scrolled past the timeline top
    const scrolled = windowHeight - timelineTop;

    // Clamp line height
    let lineHeight = 0;
    if (scrolled <= 0) {
      lineHeight = 0;
    } else if (scrolled >= timelineHeight) {
      lineHeight = timelineHeight;
    } else {
      lineHeight = scrolled;
    }
    tlLine.style.height = lineHeight + "px";

    // For each timeline item, check if the line has reached its dot position
    tlItems.forEach((item) => {
      // Dot position relative to the timeline container
      const itemTop = item.offsetTop;
      const dotOffset = itemTop + 35; // roughly where the dot sits (top: 2.2rem)

      if (lineHeight >= dotOffset) {
        // Line has reached this dot — pop it in
        if (!item.classList.contains("dot-active")) {
          item.classList.add("dot-active");

          // After dot pops in, slide in the card
          setTimeout(() => {
            item.classList.add("visible");
          }, 300);
        }
      }
    });
  };

  window.addEventListener("scroll", animateTimeline);
  window.addEventListener("resize", animateTimeline);
  setTimeout(animateTimeline, 150);

  // --- Prevent cert flip when hovering View Certificate link ---
  document.querySelectorAll(".cert-link").forEach((link) => {
    link.addEventListener("mouseenter", () => {
      const flipCard = link.closest(".cert-flip");
      if (flipCard) flipCard.classList.add("no-flip");
    });
    link.addEventListener("mouseleave", () => {
      const flipCard = link.closest(".cert-flip");
      if (flipCard) flipCard.classList.remove("no-flip");
    });
  });

  // --- Theme Toggle (Dark / Light) ---
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('i');
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }

  themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      if (current === 'dark') {
          document.documentElement.removeAttribute('data-theme');
          localStorage.setItem('theme', 'light');
          themeIcon.className = 'fas fa-moon';
      } else {
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('theme', 'dark');
          themeIcon.className = 'fas fa-sun';
      }
  });

  // --- Floating Background Shapes ---
  const shapesContainer = document.getElementById('floatingShapes');
  const shapeColors = [
      'rgba(5, 150, 105, 0.6)',
      'rgba(16, 185, 129, 0.6)',
      'rgba(52, 211, 153, 0.6)',
      'rgba(167, 243, 208, 0.6)',
      'rgba(236, 253, 245, 0.6)',
  ];

  function randomBetween(min, max) {
      return Math.random() * (max - min) + min;
  }

  for (let i = 0; i < 25; i++) {
      const shape = document.createElement('div');
      shape.classList.add('floating-shape');

      const size = randomBetween(20, 80);
      const color = shapeColors[Math.floor(Math.random() * shapeColors.length)];

      // Random start position
      shape.style.width = size + 'px';
      shape.style.height = size + 'px';
      shape.style.background = color;
      shape.style.left = randomBetween(0, 100) + '%';
      shape.style.top = randomBetween(0, 100) + '%';

      // Random float path via CSS custom properties
      shape.style.setProperty('--dx1', randomBetween(-120, 120) + 'px');
      shape.style.setProperty('--dy1', randomBetween(-120, 120) + 'px');
      shape.style.setProperty('--dx2', randomBetween(-150, 150) + 'px');
      shape.style.setProperty('--dy2', randomBetween(-150, 150) + 'px');
      shape.style.setProperty('--dx3', randomBetween(-120, 120) + 'px');
      shape.style.setProperty('--dy3', randomBetween(-120, 120) + 'px');

      // Random animation duration for organic feel
      shape.style.animationDuration = randomBetween(15, 35) + 's';
      shape.style.animationDelay = randomBetween(0, 10) + 's';

      // Some shapes are not circles
      if (Math.random() > 0.5) {
          shape.style.borderRadius = randomBetween(20, 50) + '%';
      }

      shapesContainer.appendChild(shape);
  }

  // --- Resume Modal ---
  const resumeModal = document.getElementById('resumeModal');
  const openResumeBtn = document.getElementById('openResumeBtn');
  const closeResumeBtn = document.getElementById('closeResumeBtn');

  openResumeBtn.addEventListener('click', () => {
      resumeModal.classList.add('open');
      document.body.style.overflow = 'hidden';
  });

  closeResumeBtn.addEventListener('click', () => {
      resumeModal.classList.remove('open');
      document.body.style.overflow = '';
  });

  // Close on overlay click
  resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
          resumeModal.classList.remove('open');
          document.body.style.overflow = '';
      }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && resumeModal.classList.contains('open')) {
          resumeModal.classList.remove('open');
          document.body.style.overflow = '';
      }
  });

  // ==========================================================================
  // Resume Chatbot
  // ==========================================================================
  const chatToggle = document.getElementById("chatbotToggle");
  const chatWindow = document.getElementById("chatbotWindow");
  const chatClose = document.getElementById("chatbotClose");
  const chatMessages = document.getElementById("chatbotMessages");
  const chatInput = document.getElementById("chatbotInput");
  const chatSend = document.getElementById("chatbotSend");

  // Toggle open/close
  chatToggle.addEventListener("click", () => {
    chatWindow.classList.toggle("open");
  });

  chatClose.addEventListener("click", () => {
    chatWindow.classList.remove("open");
  });

  // Close chatbot on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && chatWindow.classList.contains("open")) {
      chatWindow.classList.remove("open");
    }
  });

  // Add suggestion chips to the welcome message
  const firstBotMsg = chatMessages.querySelector(".chat-bubble");
  if (firstBotMsg) {
    const chips = document.createElement("div");
    chips.className = "chat-chips";
    chips.innerHTML = `
      <span class="chat-chip" data-q="What are your skills?">Skills</span>
      <span class="chat-chip" data-q="Tell me about your projects">Projects</span>
      <span class="chat-chip" data-q="What is your education?">Education</span>
      <span class="chat-chip" data-q="What certificates do you have?">Certificates</span>
      <span class="chat-chip" data-q="What are your achievements?">Achievements</span>
    `;
    firstBotMsg.appendChild(chips);

    chips.querySelectorAll(".chat-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const q = chip.getAttribute("data-q");
        chatInput.value = q;
        handleSend();
      });
    });
  }

  // Resume knowledge base
  const resumeKB = [
    {
      keywords: ["skill", "language", "tech", "stack", "technology", "know", "proficient", "tools", "framework"],
      answer: `<strong>Languages:</strong> Python, Java, HTML, CSS, JavaScript, PostgreSQL<br><br>
<strong>Frameworks:</strong> NumPy, Pandas, Matplotlib, Scikit-Learn, PyTorch, React, Django, OpenCV, MediaPipe<br><br>
<strong>Tools/Platforms:</strong> LeetCode, GitHub, Figma, Canva, Docker, Kafka, VS Code, Windows, Antigravity<br><br>
<strong>Core Competencies:</strong> Leadership, Problem-Solving, Adaptability, Management, Effective Planning`
    },
    {
      keywords: ["project", "work", "built", "develop", "portfolio", "made", "create"],
      answer: `Divyanshi has built <strong>4 major projects</strong>:<br><br>
<strong>1. Mini Aladdin</strong><br>
Investment management platform using Java, PostgreSQL, React, and Docker.<br><br>
<strong>2. Water Quality Analyzer</strong><br>
XGBoost ML model predicting potability with 97% accuracy via a Flask web app.<br><br>
<strong>3. Stock Price Predictor</strong><br>
ML system analyzing historical data to forecast stock prices with 89% accuracy.<br><br>
<strong>4. MediHelp</strong><br>
Family medical assistance app designed in Figma with SOS alerts and AI voice integration.`
    },
    {
      keywords: ["education", "college", "university", "degree", "school", "study", "cgpa"],
      answer: `<strong>B.Tech in Computer Science and Engineering</strong><br>
Lovely Professional University, Punjab<br>
Since Aug 2023<br><br>
<strong>Senior Secondary (12th)</strong><br>
Shiksha Bharti Vidyalaya (68%)<br>
2022 – 2023`
    },
    {
      keywords: ["certificate", "certification", "certified", "course", "coursera", "oracle", "udemy"],
      answer: `Divyanshi holds 4 major certificates:<br><br>
• Oracle Cloud Infrastructure – AI Foundations (Oct 2025)<br>
• Python for Data Science and Machine Learning Bootcamp | Udemy (Oct 2025)<br>
• Think Design Prototype - Summer Training (Figma) | LPU (July 2025)<br>
• Fundamentals of Management | Coursera (Oct 2023)`
    },
    {
      keywords: ["achievement", "hackathon", "leetcode", "coding", "competition", "podcast"],
      answer: `<strong>Podcast Host:</strong> Launched a channel for student entrepreneurs.<br><br>
<strong>HR at Metaverse:</strong> Manages recruitment and onboarding at LPU Student Org.<br><br>
<strong>Debate Winner:</strong> Secured 1st prize in Infenion's debate competition.`
    },
    {
      keywords: ["contact", "email", "phone", "reach", "hire", "connect", "linkedin", "github"],
      answer: `📧 <strong>Email:</strong> divyanshivats1305@gmail.com<br>
📱 <strong>Phone:</strong> +91-9350549002<br>
💼 <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/Divyanshi-vats03/" target="_blank">linkedin.com/in/Divyanshi-vats03</a><br>
🐙 <strong>GitHub:</strong> <a href="https://github.com/DivyanshiVats13" target="_blank">github.com/DivyanshiVats13</a>`
    },
    {
      keywords: ["who", "about", "name", "introduction", "introduce", "yourself", "summary", "overview"],
      answer: `<strong>Divyanshi Vats</strong> is a passionate problem-solver, Machine Learning enthusiast, and Software Engineer. She specializes in Python, React, Java, and building platforms spanning Data Science to Full-stack deployments.`
    },
    {
      keywords: ["hi", "hello", "hey", "sup", "good morning", "good evening"],
      answer: `Hey there! 👋 I'm Divyanshi's AI assistant. Feel free to ask me about her skills, projects, education, certificates, or achievements!`
    }
  ];

  // Find the best matching response
  function getResponse(input) {
    const lower = input.toLowerCase().trim();

    if (!lower) return "Please type a question to get started! 😊";

    let bestMatch = null;
    let bestScore = 0;

    for (const entry of resumeKB) {
      let score = 0;
      for (const kw of entry.keywords) {
        if (lower.includes(kw)) {
          score += kw.length; // Longer keyword matches = more specific
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }

    if (bestMatch && bestScore > 0) {
      return bestMatch.answer;
    }

    return `I can answer questions about Divyanshi's <strong>skills</strong>, <strong>projects</strong>, <strong>education</strong>, <strong>certificates</strong>, <strong>achievements</strong>, and <strong>contact info</strong>. Try asking something like "What are your skills?" or "Tell me about your projects"!`;
  }

  // Add a message to the chat
  function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = `chat-msg ${sender}`;
    msg.innerHTML = `<div class="chat-bubble">${text}</div>`;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Show typing indicator, then respond
  function botReply(input) {
    // Show typing indicator
    const typing = document.createElement("div");
    typing.className = "chat-msg bot";
    typing.innerHTML = `<div class="chat-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>`;
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate thinking delay
    setTimeout(() => {
      chatMessages.removeChild(typing);
      const response = getResponse(input);
      addMessage(response, "bot");
    }, 800 + Math.random() * 600);
  }

  // Handle sending a message
  function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    chatInput.value = "";
    botReply(text);
  }

  chatSend.addEventListener("click", handleSend);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSend();
  });
});
