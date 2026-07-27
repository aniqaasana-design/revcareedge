/**
 * RevCare Edge Chat Widget
 * Premium visual styling, keyword-matching assistant, and Tawk.to human handoff.
 */

(function () {
  // --- CONFIGURATION PLACEHOLDERS ---
  const TAWK_PROPERTY_ID = '6a64d9f065781e1d468db5bd';
  const TAWK_WIDGET_ID = '1jucv6lpj';

  // --- EARLY TAWK.TO SUPPRESSION & PRE-LOAD ---
  if (TAWK_PROPERTY_ID !== 'YOUR_PROPERTY_ID' && TAWK_WIDGET_ID !== 'YOUR_WIDGET_ID') {
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Immediately hide Tawk's default bubble, widget, or greeting on load
    window.Tawk_API.onLoad = function () {
      if (window.Tawk_API && window.Tawk_API.hideWidget) {
        window.Tawk_API.hideWidget();
      }
    };

    // When user closes Tawk chat, hide Tawk widget and restore RevCare custom bubble
    window.Tawk_API.onChatMinimized = function () {
      if (window.Tawk_API && window.Tawk_API.hideWidget) {
        window.Tawk_API.hideWidget();
      }
      const trigger = document.getElementById('revcare-chat-trigger');
      if (trigger) trigger.style.display = 'flex';
    };

    window.Tawk_API.onChatHidden = function () {
      const trigger = document.getElementById('revcare-chat-trigger');
      if (trigger) trigger.style.display = 'flex';
    };

    window.Tawk_API.onChatMaximized = function () {
      const trigger = document.getElementById('revcare-chat-trigger');
      const win = document.getElementById('revcare-chat-window');
      if (trigger) trigger.style.display = 'none';
      if (win) win.classList.remove('open');
    };

    // Inject Tawk.to script asynchronously early
    (function () {
      var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0] || document.head;
      s1.async = true;
      s1.src = 'https://embed.tawk.to/' + TAWK_PROPERTY_ID + '/' + TAWK_WIDGET_ID;
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();
  }

  // --- STYLING INJECTION ---
  const style = document.createElement('style');
  style.textContent = `
    /* Fully suppress Tawk.to default floating bubble / greetings / badges */
    .tawk-min-container,
    #tawk-bubble-container,
    iframe[title*="chat bubble"],
    iframe[title*="greeting"] {
      display: none !important;
    }

    #revcare-chat-connecting {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background-color: #101828;
      border: 1.5px solid #3E7B4F;
      border-radius: 30px;
      padding: 12px 20px;
      box-shadow: 0 8px 24px rgba(16, 24, 40, 0.18);
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 999999;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: #ffffff;
      opacity: 0;
      transform: translateY(12px) scale(0.95);
      pointer-events: none;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
    #revcare-chat-connecting.active {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }
    .revcare-spinner {
      width: 16px;
      height: 16px;
      border: 2.2px solid rgba(255, 255, 255, 0.2);
      border-top-color: #3E7B4F;
      border-radius: 50%;
      animation: revcare-spin 0.75s linear infinite;
    }
    @keyframes revcare-spin {
      to { transform: rotate(360deg); }
    }
    #revcare-chat-trigger {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      background-color: #101828;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 20px rgba(16, 24, 40, 0.15);
      cursor: pointer;
      z-index: 99999;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    #revcare-chat-trigger:hover {
      transform: scale(1.08);
      background-color: #1F2D44;
      box-shadow: 0 8px 24px rgba(16, 24, 40, 0.22);
    }
    #revcare-chat-trigger svg {
      width: 26px;
      height: 26px;
      fill: none;
      stroke: #ffffff;
      stroke-width: 2;
      transition: transform 0.3s;
    }
    #revcare-chat-trigger.active svg {
      transform: rotate(90deg);
    }
    
    #revcare-chat-window {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 380px;
      max-width: calc(100vw - 48px);
      height: 520px;
      max-height: calc(100vh - 120px);
      background-color: #ffffff;
      border-radius: 16px;
      box-shadow: 0 12px 32px rgba(16, 24, 40, 0.22);
      display: flex;
      flex-direction: column;
      z-index: 99999;
      overflow: hidden;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    #revcare-chat-window.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }
    
    #revcare-chat-header {
      background-color: #101828;
      color: #ffffff;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    #revcare-chat-profile {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    #revcare-chat-avatar-wrapper {
      position: relative;
      width: 40px;
      height: 40px;
    }
    
    #revcare-chat-avatar {
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255, 255, 255, 0.3);
      font-size: 20px;
    }
    
    #revcare-chat-status-dot {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 12px;
      height: 12px;
      background-color: #4ADE80;
      border: 2px solid #101828;
      border-radius: 50%;
    }
    
    #revcare-chat-title-container {
      display: flex;
      flex-direction: column;
    }
    
    #revcare-chat-name {
      font-weight: 700;
      font-size: 15px;
      line-height: 1.2;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    
    #revcare-chat-status-text {
      font-size: 11px;
      opacity: 0.9;
      font-family: 'Plus Jakarta Sans', sans-serif;
      margin-top: 2px;
    }
    
    #revcare-chat-close-btn {
      background: transparent;
      border: none;
      color: #ffffff;
      cursor: pointer;
      opacity: 0.8;
      padding: 4px;
      transition: opacity 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #revcare-chat-close-btn:hover {
      opacity: 1;
    }
    
    #revcare-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background-color: #F8FAFC;
    }
    
    .revcare-chat-msg {
      max-width: 85%;
      padding: 12px 16px;
      border-radius: 14px;
      font-size: 14px;
      line-height: 1.45;
      font-family: 'Plus Jakarta Sans', sans-serif;
      animation: revcare-fade-in-slide 0.3s ease forwards;
    }
    
    .revcare-chat-msg.bot {
      background-color: #3E7B4F;
      color: #ffffff;
      align-self: flex-start;
      border-radius: 12px;
    }
    
    .revcare-chat-msg.bot a {
      color: #ffffff;
      text-decoration: underline;
      font-weight: 600;
    }
    
    .revcare-chat-msg.bot a:hover {
      color: #F5872E;
    }
    
    .revcare-chat-msg.user {
      background-color: #F0F2F5;
      color: #101828;
      align-self: flex-end;
      border-radius: 12px;
    }
    
    .revcare-chat-msg.system-bot {
      background-color: #FEF3C7;
      color: #92400E;
      border: 1px solid #FDE68A;
      align-self: center;
      text-align: center;
      max-width: 90%;
      font-size: 13px;
      border-radius: 8px;
    }
    
    #revcare-chat-quick-replies {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 8px 16px;
      background-color: #F8FAFC;
      border-top: 1px solid rgba(226, 232, 240, 0.5);
    }
    
    .revcare-chat-btn {
      background: #ffffff;
      border: 1px solid #E2E8F0;
      color: #3E7B4F;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    
    .revcare-chat-btn:hover {
      background-color: #F1F5F9;
      border-color: #3E7B4F;
      color: #2F5D3C;
    }
    
    #revcare-chat-input-area {
      border-top: 1px solid #E2E8F0;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      background-color: #ffffff;
    }
    
    #revcare-chat-input {
      flex: 1;
      border: 1px solid #CBD5E1;
      border-radius: 24px;
      padding: 10px 16px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    
    #revcare-chat-input:focus {
      border-color: #3E7B4F;
    }
    
    #revcare-chat-send-btn {
      background-color: #F5872E;
      color: #ffffff;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.2s, transform 0.2s;
      box-shadow: 0 2px 4px rgba(245, 135, 46, 0.2);
      flex-shrink: 0;
    }
    
    #revcare-chat-send-btn:hover {
      background-color: #E27720;
      transform: scale(1.05);
    }
    
    #revcare-chat-send-btn svg {
      width: 18px;
      height: 18px;
      fill: none;
      stroke: #ffffff;
      stroke-width: 2;
    }
    
    /* Typing Indicator */
    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 12px 16px;
      background-color: #3E7B4F;
      border-radius: 12px;
      align-self: flex-start;
      max-width: 80%;
      animation: revcare-fade-in-slide 0.3s ease forwards;
    }
    
    .typing-indicator span {
      width: 6px;
      height: 6px;
      background-color: rgba(255, 255, 255, 0.7);
      border-radius: 50%;
      animation: bounce 1.3s infinite ease-in-out;
    }
    
    .typing-indicator span:nth-child(2) {
      animation-delay: 0.15s;
    }
    
    .typing-indicator span:nth-child(3) {
      animation-delay: 0.3s;
    }
    
    @keyframes bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-4px); }
    }
    
    @keyframes revcare-fade-in-slide {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);

  // --- DYNAMIC WIDGET INJECTION ---
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Create Trigger Bubble
    const trigger = document.createElement('div');
    trigger.id = 'revcare-chat-trigger';
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('aria-label', 'Open support chat');
    trigger.innerHTML = `
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    `;
    document.body.appendChild(trigger);

    // 2. Create Chat Window
    const win = document.createElement('div');
    win.id = 'revcare-chat-window';
    win.setAttribute('aria-hidden', 'true');
    win.innerHTML = `
      <div id="revcare-chat-header">
        <div id="revcare-chat-profile">
          <div id="revcare-chat-avatar-wrapper">
            <div id="revcare-chat-avatar">🤖</div>
            <div id="revcare-chat-status-dot"></div>
          </div>
          <div id="revcare-chat-title-container">
            <span id="revcare-chat-name">RevCare Assistant</span>
            <span id="revcare-chat-status-text">● Online</span>
          </div>
        </div>
        <button id="revcare-chat-close-btn" aria-label="Close chat window">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div id="revcare-chat-messages"></div>
      <div id="revcare-chat-quick-replies"></div>
      
      <div id="revcare-chat-input-area">
        <input type="text" id="revcare-chat-input" placeholder="Type your message..." aria-label="Type message">
        <button id="revcare-chat-send-btn" aria-label="Send message">
          <svg viewBox="0 0 24 24">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    `;
    document.body.appendChild(win);

    // 3. Create Connecting Toast Indicator
    const connectingToast = document.createElement('div');
    connectingToast.id = 'revcare-chat-connecting';
    connectingToast.setAttribute('aria-live', 'polite');
    connectingToast.innerHTML = `
      <div class="revcare-spinner"></div>
      <span>Connecting you to our team...</span>
    `;
    document.body.appendChild(connectingToast);

    function showConnectingIndicator() {
      connectingToast.classList.add('active');
    }

    function hideConnectingIndicator() {
      connectingToast.classList.remove('active');
    }

    // --- ELEMENT CACHING ---
    const messagesContainer = document.getElementById('revcare-chat-messages');
    const quickRepliesContainer = document.getElementById('revcare-chat-quick-replies');
    const chatInput = document.getElementById('revcare-chat-input');
    const sendBtn = document.getElementById('revcare-chat-send-btn');
    const closeBtn = document.getElementById('revcare-chat-close-btn');

    let isWindowOpen = false;

    // --- INTERACTIVE TOGGLING ---
    function toggleChatWindow() {
      if (isWindowOpen) {
        closeChatWindow();
      } else {
        openChatWindow();
      }
    }

    function openChatWindow() {
      isWindowOpen = true;
      win.style.display = 'flex';
      void win.offsetWidth;
      win.classList.add('open');
      win.setAttribute('aria-hidden', 'false');
      trigger.style.display = 'none';
      chatInput.focus();

      // Start welcome flow if feed is empty
      if (messagesContainer.children.length === 0) {
        showWelcomeMessage();
      }
    }

    function closeChatWindow() {
      isWindowOpen = false;
      win.classList.remove('open');
      win.style.display = 'none';
      win.setAttribute('aria-hidden', 'true');
      trigger.style.display = 'flex';
    }

    trigger.addEventListener('click', toggleChatWindow);
    closeBtn.addEventListener('click', closeChatWindow);

    // --- MESSAGE RENDERING ---
    function addMessage(sender, text) {
      const msg = document.createElement('div');
      msg.className = `revcare-chat-msg ${sender}`;
      msg.innerHTML = text;
      messagesContainer.appendChild(msg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showTypingIndicator() {
      // Remove existing typing indicators if any
      hideTypingIndicator();

      const indicator = document.createElement('div');
      indicator.className = 'typing-indicator';
      indicator.innerHTML = `<span></span><span></span><span></span>`;
      messagesContainer.appendChild(indicator);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function hideTypingIndicator() {
      const indicators = messagesContainer.querySelectorAll('.typing-indicator');
      indicators.forEach(i => i.remove());
    }

    function showQuickReplies(replies) {
      quickRepliesContainer.innerHTML = '';
      replies.forEach(reply => {
        const btn = document.createElement('button');
        btn.className = 'revcare-chat-btn';
        btn.textContent = reply.text;
        btn.addEventListener('click', () => {
          handleInput(reply.text, reply.value);
        });
        quickRepliesContainer.appendChild(btn);
      });
    }

    function clearQuickReplies() {
      quickRepliesContainer.innerHTML = '';
    }

    // --- EXPANDED COMPREHENSIVE KNOWLEDGE BASE ---
    const BOT_KNOWLEDGE = [
      {
        id: "handoff",
        type: "handoff",
        triggers: [
          "human", "agent", "person", "representative", "live agent", "speak to a person",
          "talk to a human", "tawk", "staff", "real person", "help desk", "operator",
          "customer service", "talk to human", "speak with agent", "connect to agent"
        ],
        text: "No problem! Let me connect you with a member of our team."
      },
      {
        id: "company_overview",
        type: "text",
        triggers: [
          "what do you do", "who are you", "about us", "about revcare", "what is revcare",
          "overview", "who is revcare", "company overview", "tell me about revcare",
          "revcare edge", "revcare", "what does revcare do", "what is your company"
        ],
        text: "RevCare Edge is a leading provider of medical billing and Revenue Cycle Management (RCM) solutions. We help healthcare practices maximize reimbursements, eliminate revenue leaks, ensure strict HIPAA compliance, and reduce administrative burden so providers can focus on patient care."
      },
      {
        id: "billing_rcm",
        type: "text",
        triggers: [
          "medical billing", "rcm", "revenue cycle management", "claim submission",
          "claims submission", "denial management", "accounts receivable", "ar follow up",
          "vob", "verification of benefits", "medical coding", "hospice billing",
          "dental billing", "in-network billing", "out-of-network billing", "clean claims",
          "billing services", "claims processing", "reimbursements", "billing audit"
        ],
        text: "Our <strong>Medical Billing & RCM</strong> solutions cover the complete revenue cycle: 24-hour electronic claim submissions with a 99% acceptance rate, aggressive denial & AR management, verification of benefits (VOB), certified medical coding, and hospice/dental billing. Learn more on our <a href='services.html' class='text-[#3E7B4F] underline font-semibold'>Services Page</a>!"
      },
      {
        id: "credentialing",
        type: "text",
        triggers: [
          "credentialing", "provider credentialing", "caqh", "caqh management",
          "payer enrollment", "insurance enrollment", "provider licensing", "group enrollment",
          "re-credentialing", "recredentialing", "medicare enrollment", "medicaid enrollment",
          "in-network enrollment", "enrollment services", "license renewal"
        ],
        text: "Our <strong>Credentialing & Payer Enrollment</strong> services manage initial provider credentialing, re-credentialing, CAQH profile setup & maintenance, commercial & government (Medicare/Medicaid) group enrollment, and licensing support to get your practice contracted and billing without delays."
      },
      {
        id: "practice_management",
        type: "text",
        triggers: [
          "practice management", "virtual assistant", "virtual assistants", "billing manager",
          "medical scribe", "medical scribing", "patient help desk", "admin support",
          "remote assistant", "front desk support", "administrative support", "clinic management"
        ],
        text: "Our <strong>Practice Management</strong> services provide dedicated medical virtual assistants, billing managers, real-time medical scribing, and a patient help desk to streamline clinical workflows, lower overhead costs, and reduce staff burnout."
      },
      {
        id: "bookkeeping",
        type: "text",
        triggers: [
          "bookkeeping", "accounting", "financial reporting", "revenue tracking",
          "cash flow", "financial management", "accountant", "practice accounting",
          "financial audit", "payroll", "expense tracking", "financial health"
        ],
        text: "We provide specialized <strong>Bookkeeping & Accounting Services</strong> for healthcare practices, including real-time revenue tracking, expense categorization, financial reporting, and cash flow management to keep your practice financially healthy and organized."
      },
      {
        id: "digital_growth",
        type: "text",
        triggers: [
          "digital growth", "healthcare marketing", "medical website", "seo",
          "local seo", "patient acquisition", "social media management", "branding",
          "clinic marketing", "website design", "marketing services", "digital marketing"
        ],
        text: "Our <strong>Healthcare Digital Growth</strong> services focus on custom medical website development, local SEO optimization, digital marketing campaigns, and social media branding to enhance your practice's online presence and attract new patients."
      },
      {
        id: "why_us",
        type: "text",
        triggers: [
          "why us", "why choose revcare", "why revcare", "what makes you different",
          "differentiators", "why outsource", "benefits of revcare", "why choose us",
          "advantages", "competitive advantage"
        ],
        text: "<strong>Why Healthcare Practices Choose RevCare Edge:</strong><br>• <strong>Healthcare Specialty Focus</strong>: 100% dedicated to medical RCM.<br>• <strong>99% Claim Acceptance</strong>: Clean claim submissions for faster payouts.<br>• <strong>Transparent Analytics</strong>: Real-time reporting & dashboards.<br>• <strong>No Long-Term Lock-in</strong>: Flexible monthly performance agreements.<br>• <strong>HIPAA Compliant</strong>: Bank-level data security."
      },
      {
        id: "process_overview",
        type: "text",
        triggers: [
          "process", "how it works", "onboarding process", "steps", "onboarding",
          "how do we start", "implementation process", "getting started steps"
        ],
        text: "Our <strong>6-Step Onboarding Process</strong>:<br>1. Free Practice Analysis & Audit<br>2. Custom Action Plan<br>3. System Integration & Setup<br>4. Dedicated RCM Team Assignment<br>5. Active Billing & Daily Monitoring<br>6. Performance & Replacement Guarantee"
      },
      {
        id: "process_step_free_analysis",
        type: "text",
        triggers: [
          "free analysis", "practice audit", "revenue leak audit", "free audit",
          "audit", "billing review", "free assessment"
        ],
        text: "<strong>Step 1: Free Practice Analysis</strong> — We perform a comprehensive audit of your current billing, rejection rates, and AR to uncover hidden revenue leaks and coding errors within 24 hours — 100% free with zero obligation!"
      },
      {
        id: "process_step_custom_plan",
        type: "text",
        triggers: [
          "custom plan", "tailored strategy", "action plan", "custom roadmap"
        ],
        text: "<strong>Step 2: Custom Action Plan</strong> — Based on your audit results, we build a customized billing and workflow strategy tailored specifically to your practice size, specialty, and financial targets."
      },
      {
        id: "process_step_integration",
        type: "text",
        triggers: [
          "integration", "system setup", "emr setup", "ehr integration", "software setup"
        ],
        text: "<strong>Step 3: System Integration</strong> — We seamlessly connect with your existing EMR/EHR software or billing portal with zero downtime or disruption to your daily clinic operations."
      },
      {
        id: "process_step_dedicated_team",
        type: "text",
        triggers: [
          "dedicated support", "dedicated team", "billing manager assignment", "assigned team"
        ],
        text: "<strong>Step 4: Dedicated RCM Team</strong> — You are paired with a dedicated billing manager and specialty-certified RCM experts who serve as an extension of your practice staff."
      },
      {
        id: "process_step_monitoring",
        type: "text",
        triggers: [
          "monitoring", "active billing", "daily monitoring", "claims monitoring", "tracking claims"
        ],
        text: "<strong>Step 5: Active Billing & Monitoring</strong> — We submit clean claims daily, perform aggressive follow-ups on unpaid AR, and provide transparent weekly financial reports."
      },
      {
        id: "process_step_guarantee",
        type: "text",
        triggers: [
          "replacement guarantee", "satisfaction guarantee", "guarantee", "performance guarantee"
        ],
        text: "<strong>Step 6: Performance & Replacement Guarantee</strong> — We guarantee continuous service excellence, ongoing revenue optimization, and complete peace of mind for your practice."
      },
      {
        id: "specialties_overview",
        type: "text",
        triggers: [
          "specialties", "what specialties", "specialty billing", "specialties supported",
          "which specialties", "medical specialties", "all specialties"
        ],
        text: "We support billing for 30+ medical specialties, including Behavioral Health, Cardiology, Orthopedics, Pediatrics, Dermatology, Gastroenterology, Urgent Care, Neurology, Oncology, and more! Explore all on our <a href='specialties.html' class='text-[#3E7B4F] underline font-semibold'>Specialties Page</a>."
      },
      {
        id: "specialty_behavioral_health",
        type: "text",
        triggers: [
          "behavioral health", "psychiatry", "psychology", "mental health", "substance abuse",
          "addiction", "therapy billing", "behavioral health billing"
        ],
        text: "Yes! We specialize in <strong>Behavioral Health & Psychiatry</strong> billing, handling prior authorization tracking, telehealth billing rules, and complex CPT coding. See details on our <a href='specialties.html' class='text-[#3E7B4F] underline font-semibold'>Specialties Page</a>."
      },
      {
        id: "specialty_cardiology",
        type: "text",
        triggers: ["cardiology", "cardiologist", "heart clinic", "cardiac billing", "cardiology billing"],
        text: "Yes! We specialize in <strong>Cardiology</strong> billing, expert in diagnostic procedure coding, cardiac catheterizations, stress testing, and multi-modifier claims."
      },
      {
        id: "specialty_orthopedics",
        type: "text",
        triggers: ["orthopedics", "orthopaedic", "sports medicine", "joint surgery", "ortho billing", "orthopedics billing"],
        text: "Yes! We provide tailored billing for <strong>Orthopedics & Sports Medicine</strong>, covering surgical coding, DME claims, fracture care, and physical therapy bundling."
      },
      {
        id: "specialty_pediatrics",
        type: "text",
        triggers: ["pediatrics", "pediatrician", "child care clinic", "pediatric billing", "pediatrics billing"],
        text: "Yes! We support <strong>Pediatrics</strong> billing, managing immunization coding, preventive care schedules, developmental screening, and Medicaid/CHIP claims."
      },
      {
        id: "specialty_dermatology",
        type: "text",
        triggers: ["dermatology", "dermatologist", "skin clinic", "dermatology billing"],
        text: "Yes! We support <strong>Dermatology</strong> billing, distinguishing cosmetic vs medical procedures, MOHS surgery coding, and pathology specimen billing."
      },
      {
        id: "specialty_gastroenterology",
        type: "text",
        triggers: ["gastroenterology", "gi clinic", "endoscopy", "colonoscopy", "gi billing", "gastroenterology billing"],
        text: "Yes! We support <strong>Gastroenterology</strong> billing, expert in endoscopy/colonoscopy coding, screening vs diagnostic distinctions, and modifier management."
      },
      {
        id: "specialty_urgent_care",
        type: "text",
        triggers: ["urgent care", "walk in clinic", "emergency clinic", "urgent care billing"],
        text: "Yes! We manage high-volume <strong>Urgent Care</strong> billing with fast 24-hour claim turnarounds, front-desk copay reconciliation, and E/M level selection."
      },
      {
        id: "specialty_neurology",
        type: "text",
        triggers: ["neurology", "neurologist", "eeg billing", "emg billing", "neurology billing"],
        text: "Yes! We support <strong>Neurology</strong> billing, covering EEG/EMG diagnostic testing, nerve conduction studies, and chronic care management claims."
      },
      {
        id: "specialty_oncology",
        type: "text",
        triggers: ["oncology", "oncologist", "chemotherapy", "cancer clinic", "oncology billing"],
        text: "Yes! We support <strong>Oncology</strong> billing with precise coding for chemotherapy infusions, biological drugs, and prior authorization tracking."
      },
      {
        id: "specialty_other",
        type: "text",
        triggers: [
          "chiropractic", "physical therapy", "radiology", "obgyn", "obstetrics",
          "gynecology", "internal medicine", "family practice", "hospice", "dental",
          "ophthalmology", "ent", "otolaryngology", "pulmonology", "rheumatology",
          "nephrology", "endocrinology", "anesthesiology", "pathology", "podiatry", "urology"
        ],
        text: "Yes! We provide specialized medical billing for that clinical field. We tailor coding rules, modifier usage, and payer authorizations to your specific specialty. Check our <a href='specialties.html' class='text-[#3E7B4F] underline font-semibold'>Specialties Page</a> for details!"
      },
      {
        id: "pricing",
        type: "text",
        triggers: [
          "cost", "price", "pricing", "fee", "fees", "upfront", "contract", "rate",
          "percentage", "commission", "how much", "terms", "no hidden fees", "monthly fee"
        ],
        text: "We operate on a <strong>performance-based pricing model</strong>: we only earn a small percentage of what we successfully collect for you. There are <strong>no upfront setup fees</strong>, no hidden charges, and flexible monthly agreements with <strong>no long-term lock-in contracts</strong>."
      },
      {
        id: "hipaa",
        type: "text",
        triggers: [
          "hipaa", "compliant", "compliance", "security", "privacy", "phi", "secure",
          "encrypted", "data protection", "safe", "confidential"
        ],
        text: "RevCare Edge is 100% <strong>HIPAA-compliant</strong>. All patient health information (PHI), billing portals, and communication channels are protected with enterprise bank-level end-to-end encryption."
      },
      {
        id: "location_contact",
        type: "text",
        triggers: [
          "location", "address", "where are you", "phone", "email", "contact",
          "office", "texas", "austin", "phone number", "email address", "where located"
        ],
        text: "Our headquarters is located in <strong>Texas, USA</strong>.<br>• <strong>Phone</strong>: <a href='tel:8482665475' class='text-[#3E7B4F] font-semibold'>848-266-5475</a><br>• <strong>Email</strong>: <a href='mailto:contact@revcareedge.com' class='text-[#3E7B4F] font-semibold'>contact@revcareedge.com</a><br>You can also use our website contact form to reach out directly!"
      },
      {
        id: "faq_claim_speed",
        type: "text",
        triggers: ["how fast", "turnaround time", "claim submission time", "24 hours claim", "how quick"],
        text: "All clean claims are scrubbed and submitted electronically within <strong>24 hours</strong> of receiving encounter documentation, ensuring minimal reimbursement delays."
      },
      {
        id: "faq_emr_software",
        type: "text",
        triggers: [
          "emr", "ehr", "software", "kareo", "epic", "eclinicalworks", "athenahealth",
          "drchrono", "advancedmd", "system integration", "compatibility"
        ],
        text: "We integrate seamlessly with all major EHR/EMR platforms (AthenaHealth, Epic, eClinicalWorks, Kareo, DrChrono, AdvancedMD, etc.) or operate directly inside your existing software with zero migration required."
      },
      {
        id: "booking_cta",
        type: "text",
        triggers: [
          "book", "get started", "sign up", "schedule", "consultation", "request audit", "start billing"
        ],
        text: "Getting started is easy! You can request your <strong>Free Practice Analysis & Audit</strong> right now on our website contact form. Our team will review your billing setup within 24 hours."
      }
    ];

    // --- NORMALIZATION & SCORING MATCHING ENGINE ---
    function normalizeText(text) {
      return text
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    function getBotResponse(input) {
      const normalizedInput = normalizeText(input);
      if (!normalizedInput) {
        return {
          type: "fallback",
          text: "I'm not able to help with that specific question yet, but let me connect you with someone from our team who can!"
        };
      }

      let bestMatch = null;
      let highestScore = 0;

      BOT_KNOWLEDGE.forEach(topic => {
        let topicScore = 0;

        topic.triggers.forEach(trigger => {
          const normTrigger = normalizeText(trigger);
          if (!normTrigger) return;

          const triggerWords = normTrigger.split(' ');

          // Exact full message match bonus
          if (normalizedInput === normTrigger) {
            topicScore += 10;
          } else if (normalizedInput.includes(normTrigger)) {
            // Substring / Phrase match
            if (triggerWords.length > 1) {
              // Multi-word phrase matches get higher weight proportional to phrase length
              topicScore += triggerWords.length * 3;
            } else {
              // Single word match — use word boundary check
              const wordRegex = new RegExp(`\\b${normTrigger}\\b`, 'i');
              if (wordRegex.test(normalizedInput)) {
                topicScore += 2;
              }
            }
          }
        });

        if (topicScore > highestScore) {
          highestScore = topicScore;
          bestMatch = topic;
        }
      });

      // Require a minimum match score threshold
      if (bestMatch && highestScore > 0) {
        return {
          type: bestMatch.type,
          text: bestMatch.text,
          id: bestMatch.id
        };
      }

      // Fallback
      return {
        type: "fallback",
        text: "I'm not able to help with that specific question yet, but let me connect you with someone from our team who can!"
      };
    }

    // --- INPUT PROCESSING HANDLER ---
    function handleInput(text, value = null) {
      if (!text.trim()) return;

      const targetValue = value || text;
      const normalizedVal = normalizeText(targetValue);

      // INSTANT SINGLE-CLICK HANDOFF: If user clicks "Talk to a Person" or enters human agent query
      if (value === "human" || /\b(human|agent|person|representative|live|speak to a person|talk to a human|tawk|real person)\b/i.test(normalizedVal)) {
        addMessage("user", text);
        chatInput.value = '';
        clearQuickReplies();
        handoffToHuman();
        return;
      }

      // Standard Bot Conversation Flow
      addMessage("user", text);
      chatInput.value = '';
      clearQuickReplies();

      const botResponse = getBotResponse(targetValue);
      showTypingIndicator();
      setTimeout(() => {
        hideTypingIndicator();

        if (botResponse.type === "handoff") {
          handoffToHuman();
        } else if (botResponse.type === "fallback") {
          addMessage("bot", botResponse.text);
          // Show fallback system-bot alert with contact channels
          showQuickReplies([
            { text: "👥 Talk to a Person", value: "human" },
            { text: "🩺 Services Overview", value: "medical billing" },
            { text: "📊 Book Free Audit", value: "free analysis" }
          ]);
        } else {
          addMessage("bot", botResponse.text);
          // Provide relevant quick reply hints
          showQuickReplies([
            { text: "📋 Credentialing Info", value: "credentialing" },
            { text: "🩺 Medical Specialties", value: "specialties" },
            { text: "🛡️ HIPAA Compliance", value: "hipaa" },
            { text: "📊 Book Free Audit", value: "free analysis" },
            { text: "👥 Talk to a Person", value: "human" }
          ]);
        }
      }, 800); // 0.8 second typing delay
    }

    // --- TAWK.TO HUMAN HANDOFF ENGINE ---
    function handoffToHuman() {
      // 1. Force-close custom panel immediately (display:none hard close)
      closeChatWindow();

      // 2. Hide custom trigger bubble
      const trg = document.getElementById('revcare-chat-trigger');
      if (trg) trg.style.display = 'none';

      // 3. Show connecting indicator immediately (0ms delay, no blank gap!)
      showConnectingIndicator();

      // 4. Helper to attempt launching Tawk
      const launchTawk = () => {
        const tawk = window.Tawk_API;
        if (tawk && typeof tawk.maximize === 'function') {
          try {
            if (tawk.showWidget) tawk.showWidget();
            tawk.maximize();
            hideConnectingIndicator();
            return true;
          } catch (e) {
            console.error("Tawk.to launch error:", e);
            hideConnectingIndicator();
            fallbackHandoff();
            return true;
          }
        }
        return false;
      };

      // Try launching immediately if Tawk is already ready
      if (launchTawk()) return;

      // If Tawk.to is still downloading/initializing in background, set onLoad listener + poll for up to 6s
      window.Tawk_API = window.Tawk_API || {};
      const prevOnLoad = window.Tawk_API.onLoad;
      window.Tawk_API.onLoad = function () {
        if (prevOnLoad) prevOnLoad();
        launchTawk();
      };

      let attempts = 0;
      const pollInterval = setInterval(() => {
        attempts++;
        if (launchTawk()) {
          clearInterval(pollInterval);
        } else if (attempts >= 12) { // 6 seconds timeout
          clearInterval(pollInterval);
          hideConnectingIndicator();
          fallbackHandoff();
        }
      }, 500);
    }

    function fallbackHandoff() {
      hideConnectingIndicator();
      // Re-open custom panel displaying fallback alert if Tawk is offline/blocked
      win.style.display = 'flex';
      win.classList.add('open');
      const trg = document.getElementById('revcare-chat-trigger');
      if (trg) trg.style.display = 'none';

      addMessage("system-bot", "I'm trying to connect you to a live agent, but our live support channels are currently offline or unavailable. Please email us at <strong>contact@revcareedge.com</strong> or call <strong>848-266-5475</strong> for immediate assistance!");
    }

    // --- EVENT LISTENERS FOR SEND ---
    sendBtn.addEventListener('click', () => {
      handleInput(chatInput.value);
    });

    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleInput(chatInput.value);
      }
    });

    // --- WELCOME MESSAGES SEQUENCE ---
    function showWelcomeMessage() {
      setTimeout(() => {
        showTypingIndicator();
        setTimeout(() => {
          hideTypingIndicator();
          addMessage("bot", "Hello! Welcome to RevCare Edge. I am your RevCare Assistant. 🩺");
          showTypingIndicator();
          setTimeout(() => {
            hideTypingIndicator();
            addMessage("bot", "How can I help you today? Feel free to type any question below, or select a shortcut to start:");
            showQuickReplies([
              { text: "🩺 Billing & RCM", value: "medical billing" },
              { text: "📋 Credentialing", value: "credentialing" },
              { text: "🏥 Practice Management", value: "practice management" },
              { text: "🛡️ HIPAA & Security", value: "hipaa" },
              { text: "💡 Why RevCare?", value: "why choose revcare" },
              { text: "👥 Talk to a Person", value: "human" }
            ]);
          }, 850);
        }, 600);
      }, 400);
    }
  });

})();
