/* ==========================================================================
   content.js  =  TOÀN BỘ NỘI DUNG CỦA TRANG (chữ, ảnh, liên kết)

   Muốn sửa chữ trên web? Chỉ cần sửa file này, KHÔNG cần động vào file khác.
   - Phần "vi" là tiếng Việt, phần "en" là tiếng Anh. Hai phần có cấu trúc giống nhau.
   - Chữ nằm trong dấu nháy "..." hoặc '...'. Giữ nguyên dấu nháy, dấu phẩy ở cuối dòng.
   - Ảnh nằm trong thư mục assets/img/. Muốn thêm ảnh: tải ảnh lên thư mục đó,
     rồi thêm một dòng vào mục MEDIA bên dưới.
   ========================================================================== */

/* ---------- 1. Thông tin dùng chung (không phân biệt ngôn ngữ) ---------- */
const SITE = {
  name: "Phùng Thị Huyền",
  shortName: "Phùng Huyền",
  email: "phungthihuyen20051210@gmail.com",
  linkedin: "https://www.linkedin.com/in/emmaphungthihuyen/",
  facebook: "https://www.facebook.com/phung.huyen.285671/",

  // Số điện thoại được tách thành nhiều mảnh để các chương trình quét web
  // (bot gửi spam) khó thu thập. Người xem bấm "Hiện số" thì mới ghép lại.
  phoneParts: ["0375", "559", "466"],

  // Khi bạn đã tải file CV (PDF) lên thư mục assets/, điền đường dẫn vào đây,
  // ví dụ: "assets/CV-Phung-Thi-Huyen.pdf". Để trống thì nút "Tải CV" sẽ ẩn.
  cvFile: "",

  // Địa chỉ nhận form liên hệ. Để trống thì form sẽ mở ứng dụng email của người xem
  // với nội dung đã điền sẵn. Cách điền: xem README.md, mục "Form liên hệ".
  formEndpoint: "https://formsubmit.co/ajax/phungthihuyen20051210@gmail.com"
};

/* ---------- 2. Ảnh (mỗi nhóm ảnh có chú thích 2 ngôn ngữ) ---------- */
const MEDIA = {
  haposoft: [
    { src: "work-haposoft.jpg", alt: { vi: "Một buổi thuyết trình tại Haposoft", en: "A presentation session at Haposoft" } },
    { src: "work-haposoft-10y.jpg", alt: { vi: "Lễ kỷ niệm 10 năm thành lập Haposoft", en: "Haposoft's 10th anniversary celebration" } }
  ],
  gec: [
    { src: "gec-gcontest.jpg", alt: { vi: "Đêm chung kết G'Contest 2024", en: "G'Contest 2024 final night" } },
    { src: "gec-gtalk.jpg", alt: { vi: "Sự kiện G'Talk của CLB Kinh tế Toàn cầu", en: "G'Talk, an event of the Global Economics Club" } },
    { src: "gec-poster-1.jpg", alt: { vi: "Ấn phẩm truyền thông G'Contest", en: "G'Contest communication piece" } },
    { src: "gec-poster-2.jpg", alt: { vi: "Bài đăng \"Bank vs Fintech: đối thủ hay đối tác\"", en: "Post \"Bank vs Fintech: rivals or partners\"" } },
    { src: "gec-poster-3.jpg", alt: { vi: "Thông báo Training vòng 2 G'Contest 2024", en: "G'Contest 2024 round 2 training announcement" } },
    { src: "gec-poster-4.jpg", alt: { vi: "Bài đăng kiến thức về IPO", en: "Knowledge post about IPO" } },
    { src: "gec-poster-5.jpg", alt: { vi: "Ấn phẩm truyền thông cho cuộc thi", en: "Communication piece for the contest" } },
    { src: "gec-poster-6.jpg", alt: { vi: "Ấn phẩm \"Check your mail\"", en: "\"Check your mail\" communication piece" } },
    { src: "gec-poster-7.jpg", alt: { vi: "Thông báo tuyển thành viên thế hệ 13", en: "Announcement: recruiting generation 13 members" } }
  ],
  moments: [
    { src: "life-1.jpg", alt: { vi: "Ảnh đời thường của Huyền", en: "An everyday photo of Huyền" } },
    { src: "life-2.jpg", alt: { vi: "Ảnh đời thường của Huyền", en: "An everyday photo of Huyền" } },
    { src: "life-3.jpg", alt: { vi: "Ảnh đời thường của Huyền", en: "An everyday photo of Huyền" } },
    { src: "life-4.jpg", alt: { vi: "Huyền cùng các bạn trong tà áo dài", en: "Huyền with friends in áo dài" } }
  ]
};

/* ---------- 3. Nội dung tiếng Việt và tiếng Anh ---------- */
const CONTENT = {

  /* ======================= TIẾNG VIỆT ======================= */
  vi: {
    htmlLang: "vi",
    docTitle: "Phùng Huyền | Portfolio",
    metaDesc: "Portfolio của Phùng Thị Huyền, sinh viên Quản trị Kinh doanh Quốc tế, Đại học Ngoại thương.",

    ui: {
      skip: "Bỏ qua phần điều hướng",
      gateTitle: "Xin chào, mình là Huyền",
      gateQuestion: "Bạn là…?",
      gateRecruiter: "Nhà tuyển dụng",
      gateRecruiterNote: "Hồ sơ năng lực, kinh nghiệm và dự án",
      gateOther: "Người khác",
      gateOtherNote: "Làm quen, sở thích và cuộc sống của mình",
      switchView: "Đổi vai trò",
      langToggle: "EN",
      langToggleLabel: "Switch to English",
      navLabel: "Các mục chính",
      railLabel: "Kênh liên lạc",
      close: "Đóng",
      scrollHint: "Cuộn xuống",
      cv: "Tải CV",
      backHome: "Về đầu trang",
      footer: "© 2026 Phùng Huyền"
    },

    slogan: "Mình học bằng cách thử, và lớn lên nhờ kết nối.",

    hero: {
      recruiter: {
        sub: "Business Development tại Haposoft. Sinh viên năm cuối Quản trị Kinh doanh Quốc tế, Đại học Ngoại thương.",
        primary: { label: "Xem kinh nghiệm", target: "experience" },
        secondary: { label: "Liên hệ", target: "contact" }
      },
      other: {
        sub: "Mình thích đi đây đó, đọc truyện, xem phim và làm quen với những người mới.",
        primary: { label: "Xem sở thích", target: "hobbies" },
        secondary: { label: "Làm quen", target: "contact" }
      }
    },

    nav: {
      recruiter: [
        { id: "about", label: "Giới thiệu" },
        { id: "education", label: "Giáo dục" },
        { id: "skills", label: "Kỹ năng" },
        { id: "experience", label: "Kinh nghiệm" },
        { id: "projects", label: "Dự án" },
        { id: "activities", label: "Hoạt động ngoại khóa" },
        { id: "languages", label: "Ngôn ngữ" },
        { id: "contact", label: "Liên hệ" }
      ],
      other: [
        { id: "about", label: "Về mình" },
        { id: "hobbies", label: "Sở thích" },
        { id: "life", label: "Hoạt động" },
        { id: "contact", label: "Liên hệ" }
      ]
    },

    about: {
      recruiter: {
        title: "Giới thiệu",
        paragraphs: [
          "Mình là Phùng Thị Huyền, sinh viên năm cuối ngành Quản trị Kinh doanh Quốc tế tại Đại học Ngoại thương, GPA 3.74/4.0.",
          "Hiện mình làm Business Development tại Haposoft: chăm sóc hơn 100 liên hệ và 7 deal, cùng các phòng ban chuẩn bị proposal, báo giá và demo sản phẩm cho khách hàng.",
          "Mình ham học hỏi và trải nghiệm, thích kết nối với mọi người, chăm chỉ và luôn muốn tiến bộ hơn mỗi ngày."
        ],
        chips: ["GPA 3.74/4.0", "IELTS 7.0", "HSK 4", "Học bổng khuyến khích 3 kỳ"]
      },
      other: {
        title: "Về mình",
        paragraphs: [
          "Chào bạn, mình là Huyền! Mình ham học hỏi, thích trải nghiệm và đặc biệt thích làm quen với những người mới.",
          "Mình thích truyền đạt ý tưởng, thích khám phá, và tin rằng cuộc trò chuyện nào cũng có thể dạy mình điều gì đó.",
          "Mình chăm chỉ, cầu tiến, và luôn muốn tốt hơn hôm qua một chút."
        ],
        chips: ["Ham học hỏi", "Thích kết nối", "Cầu tiến", "Chăm chỉ"]
      }
    },

    education: {
      title: "Giáo dục",
      items: [
        {
          id: "ftu",
          title: "Đại học Ngoại thương (FTU), Hà Nội",
          sub: "Cử nhân Quản trị Kinh doanh Quốc tế",
          period: "2023 – 2027",
          bullets: ["GPA: 3.74/4.0", "Học bổng khuyến khích học tập 3 kỳ"],
          art: "orbit"
        }
      ],
      certTitle: "Chứng chỉ và khóa học",
      certs: [
        "Microsoft Office Specialist (MOS)",
        "IELTS 7.0",
        "HSK 4",
        "Business Analysis: phân tích yêu cầu nghiệp vụ và đặc tả Use Case (BACCM)"
      ]
    },

    skills: {
      title: "Kỹ năng",
      groups: [
        { title: "Microsoft Office", items: ["Word", "Excel", "PowerPoint"], note: "Có chứng chỉ MOS" },
        { title: "Thiết kế và nội dung", items: ["Canva", "Google Slides", "Gamma", "Figma", "draw.io"] },
        { title: "Dữ liệu", items: ["Google Sheets", "SQL", "Power BI"] },
        { title: "Công cụ AI", items: ["ChatGPT", "Claude", "Gemini", "Notion AI"], note: "Dùng trong học tập, soạn proposal và thiết kế infographic" }
      ]
    },

    experience: {
      title: "Kinh nghiệm làm việc",
      items: [
        {
          id: "haposoft",
          title: "Business Development",
          org: "Haposoft",
          period: "07/2026 – nay",
          tag: "Toàn thời gian",
          bullets: [
            "Theo dõi và chăm sóc hơn 100 liên hệ và 7 deal tại Việt Nam, Hồng Kông cùng một số thị trường khác; cập nhật đầy đủ thông tin khách hàng và tình trạng từng deal.",
            "Phối hợp với các phòng ban chuẩn bị proposal, báo giá và thực hiện 3 buổi demo sản phẩm cho khách hàng.",
            "Thiết kế infographic và tài liệu proposal bằng Canva và các công cụ AI."
          ],
          chips: ["100+ liên hệ", "7 deal", "3 buổi demo"],
          media: "haposoft",
          current: true
        },
        {
          id: "ec",
          title: "Trợ giảng Tiếng Anh",
          org: "The English Connection",
          period: "07/2024 – 09/2026",
          tag: "Bán thời gian",
          bullets: [
            "Hỗ trợ giáo viên bản xứ trước và trong giờ học: chuẩn bị học liệu phù hợp với từng nhóm học viên, điểm danh và quản lý lớp.",
            "Hỗ trợ học viên sau buổi học: báo cáo tình hình đi học và bài tập trong nhóm phụ huynh, giải đáp thắc mắc của phụ huynh và ghi hình buổi học.",
            "Giao tiếp với học viên bằng tiếng Anh, phản hồi bài tập và hỗ trợ ngoài giờ học."
          ],
          logo: "ec-logo.jpg"
        },
        {
          id: "kidzania",
          title: "Nhân viên Bán hàng và Chăm sóc khách hàng",
          org: "KidZania Hà Nội",
          period: "01/2025",
          tag: "Bán thời gian",
          bullets: ["Tư vấn và bán vé vào cửa cho khách hàng Việt Nam và quốc tế."],
          art: "compass"
        },
        {
          id: "lotte",
          title: "Nhân viên Chăm sóc khách hàng",
          org: "Lotte Mall West Lake",
          period: "10/2024 – 12/2024",
          tag: "Bán thời gian",
          bullets: ["Trực booth, mời khách hàng tải ứng dụng để tích điểm đổi quà; hỗ trợ các sự kiện theo mùa (Halloween, Ngày Phụ nữ)."],
          art: "chat"
        },
        {
          id: "tutor",
          title: "Giáo viên Tiếng Anh",
          org: "Dạy tiếng Anh tự do",
          period: "2023 – 2024",
          bullets: ["Soạn giáo án phù hợp với năng lực của từng học sinh.", "Đứng lớp với sĩ số từ 1 đến 20 học sinh."],
          art: "book"
        }
      ]
    },

    projects: {
      title: "Dự án",
      items: [
        {
          id: "finance-app",
          title: "Tính năng Quản lý Tài chính trong ứng dụng ngân hàng",
          sub: "Dự án cá nhân, khóa học Business Analysis",
          period: "04/2026 – 08/2026",
          bullets: [
            "Thu thập yêu cầu qua khảo sát người dùng; xây dựng Business Flow Diagram và mô hình hóa quy trình nghiệp vụ.",
            "Xây dựng Use Case Diagram và đặc tả chi tiết cho tính năng quản lý thu/chi; tổng hợp yêu cầu theo phương pháp BACCM."
          ],
          chips: ["Figma", "draw.io", "BACCM", "Use Case"],
          art: "orbit"
        }
      ]
    },

    activities: {
      title: "Hoạt động ngoại khóa",
      items: [
        {
          id: "gec",
          title: "Thành viên Ban Truyền thông",
          org: "CLB Kinh tế Toàn cầu (GEC), ĐH Ngoại thương",
          period: "2023 – 2024",
          bullets: [
            "Sáng tạo nội dung (bài viết, caption, infographic) và thiết kế poster; quản lý fanpage CLB: lên lịch đăng bài, theo dõi tương tác, tối ưu nội dung.",
            "Chiến dịch G'Contest: lên kế hoạch và triển khai chuỗi nội dung, tăng tương tác trung bình của bài viết hơn 30%; sản xuất ảnh, video recap và infographic hướng nghiệp.",
            "Hỗ trợ tổ chức sự kiện offline của CLB: điều phối hậu cần, check-in, ghi nhận tư liệu."
          ],
          chips: ["+30% tương tác bài viết"],
          media: "gec",
          cover: "gec-poster-2.jpg"
        },
        {
          id: "events",
          title: "Cộng tác viên sự kiện",
          period: "2023 – 2024",
          bullets: [
            "Hỗ trợ sự kiện Trung thu \"Trẩy hội trăng rằm\" (HDBank đồng hành).",
            "Hỗ trợ tổ chức Hội thảo của Khoa Kinh tế Quốc tế."
          ],
          art: "moon"
        }
      ]
    },

    languages: {
      title: "Ngôn ngữ",
      items: [
        { name: "Tiếng Việt", level: "Bản ngữ" },
        { name: "Tiếng Anh", level: "IELTS 7.0" },
        { name: "Tiếng Trung", level: "HSK 4" }
      ]
    },

    hobbies: {
      title: "Sở thích",
      intro: "Bấm vào từng ô để xem thêm nhé.",
      items: [
        { id: "travel", title: "Du lịch", art: "planet", text: "Mình thích đến những nơi mới, gặp những người mới và nghe những câu chuyện mới." },
        { id: "reading", title: "Đọc truyện", art: "book", text: "Mình thích đắm chìm trong những câu chuyện hay." },
        { id: "movies", title: "Xem phim", art: "film", text: "Mình thích xem phim, và càng thích trò chuyện về những điều đọng lại sau khi xem." },
        { id: "chat", title: "Chat chit với bạn bè", art: "chat", text: "Một buổi tám chuyện với bạn bè luôn là cách mình nạp lại năng lượng." },
        { id: "connect", title: "Kết nối và giao lưu", art: "link", text: "Mình thích làm quen, trao đổi và học hỏi từ những người xung quanh." },
        { id: "ideas", title: "Truyền đạt ý tưởng", art: "spark", text: "Mình thích biến một ý tưởng trong đầu thành điều người khác hiểu được và hào hứng cùng." },
        { id: "sport", title: "Bơi và cầu lông", art: "wave", text: "Bơi và cầu lông là hai môn mình thích. Mình đang tìm partner, bạn nào muốn rủ thì nhắn mình nhé!" },
        { id: "explore", title: "Khám phá và học hỏi", art: "compass", text: "Mình luôn tò mò về những điều mới và thích thử những việc mình chưa từng làm." }
      ]
    },

    life: {
      title: "Hoạt động",
      intro: "Một vài mảnh ghép trong cuộc sống của mình.",
      items: [
        {
          id: "life-gec",
          title: "Cùng CLB Kinh tế Toàn cầu",
          text: "Mình từng là thành viên Ban Truyền thông của CLB: viết bài, thiết kế poster và lên kế hoạch cho cả chiến dịch G'Contest.",
          media: "gec",
          cover: "gec-gcontest.jpg"
        },
        {
          id: "life-events",
          title: "Làm cộng tác viên sự kiện",
          text: "Mình từng hỗ trợ sự kiện Trung thu \"Trẩy hội trăng rằm\" và Hội thảo của Khoa Kinh tế Quốc tế.",
          art: "moon"
        },
        {
          id: "life-moments",
          title: "Khoảnh khắc đời thường",
          text: "Vài tấm ảnh trong những ngày bình thường của mình.",
          media: "moments",
          cover: "life-3.jpg"
        }
      ]
    },

    contact: {
      titleRecruiter: "Liên hệ",
      titleOther: "Làm quen",
      introRecruiter: "Bạn muốn trao đổi về cơ hội hợp tác? Gửi mình vài dòng, mình sẽ phản hồi sớm.",
      introOther: "Bạn muốn làm quen, rủ mình đi chơi, hay chơi cầu lông cùng? Nhắn mình nhé!",
      showPhone: "Hiện số điện thoại",
      channels: { linkedin: "LinkedIn: Emma Phùng", facebook: "Facebook", email: "Email", phone: "Điện thoại" },
      form: {
        name: "Họ và tên",
        email: "Email",
        facebook: "Facebook (link hoặc tên)",
        phone: "Số điện thoại (không bắt buộc)",
        message: "Lời nhắn",
        send: "Gửi lời nhắn",
        sending: "Đang gửi…",
        sent: "Đã gửi. Cảm ơn bạn, mình sẽ phản hồi sớm nhé!",
        failed: "Chưa gửi được. Bạn thử lại sau, hoặc nhắn mình qua LinkedIn hoặc Email nhé.",
        mailto: "Ứng dụng email của bạn sẽ mở ra với nội dung đã điền sẵn. Bạn bấm gửi để hoàn tất nhé.",
        subjectRecruiter: "Liên hệ từ nhà tuyển dụng qua portfolio",
        subjectOther: "Lời nhắn từ portfolio"
      }
    }
  },

  /* ======================= ENGLISH ======================= */
  en: {
    htmlLang: "en",
    docTitle: "Phùng Huyền | Portfolio",
    metaDesc: "Portfolio of Phùng Thị Huyền, International Business Administration student at Foreign Trade University.",

    ui: {
      skip: "Skip to content",
      gateTitle: "Hi, I'm Huyền",
      gateQuestion: "Who's visiting?",
      gateRecruiter: "Recruiter",
      gateRecruiterNote: "Profile, experience and projects",
      gateOther: "Someone else",
      gateOtherNote: "Say hi, and see my interests and life",
      switchView: "Change role",
      langToggle: "VI",
      langToggleLabel: "Chuyển sang tiếng Việt",
      navLabel: "Main sections",
      railLabel: "Contact channels",
      close: "Close",
      scrollHint: "Scroll down",
      cv: "Download CV",
      backHome: "Back to top",
      footer: "© 2026 Phùng Huyền"
    },

    slogan: "I learn by trying, and grow by connecting.",

    hero: {
      recruiter: {
        sub: "Business Development at Haposoft. Final-year International Business Administration student at Foreign Trade University.",
        primary: { label: "See my experience", target: "experience" },
        secondary: { label: "Contact", target: "contact" }
      },
      other: {
        sub: "I like travelling, reading stories, watching films and meeting new people.",
        primary: { label: "See my interests", target: "hobbies" },
        secondary: { label: "Say hi", target: "contact" }
      }
    },

    nav: {
      recruiter: [
        { id: "about", label: "About" },
        { id: "education", label: "Education" },
        { id: "skills", label: "Skills" },
        { id: "experience", label: "Experience" },
        { id: "projects", label: "Projects" },
        { id: "activities", label: "Extracurriculars" },
        { id: "languages", label: "Languages" },
        { id: "contact", label: "Contact" }
      ],
      other: [
        { id: "about", label: "About me" },
        { id: "hobbies", label: "Interests" },
        { id: "life", label: "Activities" },
        { id: "contact", label: "Contact" }
      ]
    },

    about: {
      recruiter: {
        title: "About",
        paragraphs: [
          "I'm Phùng Thị Huyền, a final-year student in International Business Administration at Foreign Trade University, with a GPA of 3.74/4.0.",
          "I currently work in Business Development at Haposoft: I manage over 100 contacts and 7 deals, and work with other teams to prepare proposals, quotations and product demos for clients.",
          "I love learning and trying new things, enjoy connecting with people, work hard, and always want to improve a little more each day."
        ],
        chips: ["GPA 3.74/4.0", "IELTS 7.0", "HSK 4", "3 semesters of academic scholarship"]
      },
      other: {
        title: "About me",
        paragraphs: [
          "Hi, I'm Huyền! I love learning, trying new things, and especially meeting new people.",
          "I enjoy sharing ideas and exploring, and I believe every conversation can teach me something.",
          "I'm hardworking, driven, and always trying to be a little better than yesterday."
        ],
        chips: ["Curious", "Connector", "Driven", "Hardworking"]
      }
    },

    education: {
      title: "Education",
      items: [
        {
          id: "ftu",
          title: "Foreign Trade University (FTU), Hanoi",
          sub: "Bachelor of International Business Administration",
          period: "2023 – 2027",
          bullets: ["GPA: 3.74/4.0", "Academic scholarship for 3 semesters"],
          art: "orbit"
        }
      ],
      certTitle: "Certificates and courses",
      certs: [
        "Microsoft Office Specialist (MOS)",
        "IELTS 7.0",
        "HSK 4",
        "Business Analysis: business requirements analysis and Use Case specification (BACCM)"
      ]
    },

    skills: {
      title: "Skills",
      groups: [
        { title: "Microsoft Office", items: ["Word", "Excel", "PowerPoint"], note: "MOS certified" },
        { title: "Design and content", items: ["Canva", "Google Slides", "Gamma", "Figma", "draw.io"] },
        { title: "Data", items: ["Google Sheets", "SQL", "Power BI"] },
        { title: "AI tools", items: ["ChatGPT", "Claude", "Gemini", "Notion AI"], note: "Used for studying, writing proposals and designing infographics" }
      ]
    },

    experience: {
      title: "Work experience",
      items: [
        {
          id: "haposoft",
          title: "Business Development",
          org: "Haposoft",
          period: "07/2026 – present",
          tag: "Full-time",
          bullets: [
            "Track and nurture over 100 contacts and 7 deals in Vietnam, Hong Kong and several other markets; keep client information and deal status fully up to date.",
            "Work with other departments to prepare proposals and quotations, and delivered 3 product demos for clients.",
            "Design infographics and proposal documents with Canva and AI tools."
          ],
          chips: ["100+ contacts", "7 deals", "3 demos"],
          media: "haposoft",
          current: true
        },
        {
          id: "ec",
          title: "English Teaching Assistant",
          org: "The English Connection",
          period: "07/2024 – 09/2026",
          tag: "Part-time",
          bullets: [
            "Supported native-speaker teachers before and during lessons: prepared materials suited to each student group, took attendance and managed the class.",
            "Supported students after class: reported attendance and homework in parent groups, answered parents' questions and recorded lessons.",
            "Communicated with students in English, gave feedback on homework and helped outside class hours."
          ],
          logo: "ec-logo.jpg"
        },
        {
          id: "kidzania",
          title: "Sales and Customer Care Associate",
          org: "KidZania Hanoi",
          period: "01/2025",
          tag: "Part-time",
          bullets: ["Advised and sold entrance tickets to Vietnamese and international customers."],
          art: "compass"
        },
        {
          id: "lotte",
          title: "Customer Care Associate",
          org: "Lotte Mall West Lake",
          period: "10/2024 – 12/2024",
          tag: "Part-time",
          bullets: ["Staffed the booth and invited customers to download the app to earn reward points; supported seasonal events (Halloween, Women's Day)."],
          art: "chat"
        },
        {
          id: "tutor",
          title: "English Teacher",
          org: "Freelance English teaching",
          period: "2023 – 2024",
          bullets: ["Wrote lesson plans suited to each student's level.", "Taught classes of 1 to 20 students."],
          art: "book"
        }
      ]
    },

    projects: {
      title: "Projects",
      items: [
        {
          id: "finance-app",
          title: "Financial Management Feature in a Banking App",
          sub: "Personal project, Business Analysis course",
          period: "04/2026 – 08/2026",
          bullets: [
            "Gathered requirements through user surveys; built a Business Flow Diagram and modelled the business process.",
            "Built a Use Case Diagram and detailed specification for an income/expense management feature; consolidated requirements using the BACCM method."
          ],
          chips: ["Figma", "draw.io", "BACCM", "Use Case"],
          art: "orbit"
        }
      ]
    },

    activities: {
      title: "Extracurricular activities",
      items: [
        {
          id: "gec",
          title: "Communications Team Member",
          org: "Global Economics Club (GEC), Foreign Trade University",
          period: "2023 – 2024",
          bullets: [
            "Created content (articles, captions, infographics) and designed posters; managed the club's fanpage: scheduled posts, tracked engagement and optimised content.",
            "G'Contest campaign: planned and ran a content series that raised average post engagement by over 30%; produced photos, recap videos and career-oriented infographics.",
            "Supported the club's offline events: coordinated logistics, check-in and documentation."
          ],
          chips: ["+30% post engagement"],
          media: "gec",
          cover: "gec-poster-2.jpg"
        },
        {
          id: "events",
          title: "Event Volunteer",
          period: "2023 – 2024",
          bullets: [
            "Supported the Mid-Autumn event \"Trẩy hội trăng rằm\" (sponsored by HDBank).",
            "Helped organise a seminar of the Faculty of International Economics."
          ],
          art: "moon"
        }
      ]
    },

    languages: {
      title: "Languages",
      items: [
        { name: "Vietnamese", level: "Native" },
        { name: "English", level: "IELTS 7.0" },
        { name: "Chinese", level: "HSK 4" }
      ]
    },

    hobbies: {
      title: "Interests",
      intro: "Tap any tile to see more.",
      items: [
        { id: "travel", title: "Travelling", art: "planet", text: "I like going to new places, meeting new people and hearing new stories." },
        { id: "reading", title: "Reading stories", art: "book", text: "I like getting lost in a good story." },
        { id: "movies", title: "Watching films", art: "film", text: "I like watching films, and even more talking about what stays with me afterwards." },
        { id: "chat", title: "Chatting with friends", art: "chat", text: "A good chat with friends is always how I recharge." },
        { id: "connect", title: "Connecting and socialising", art: "link", text: "I like meeting people, exchanging ideas and learning from those around me." },
        { id: "ideas", title: "Sharing ideas", art: "spark", text: "I like turning an idea in my head into something others can understand and get excited about." },
        { id: "sport", title: "Swimming and badminton", art: "wave", text: "Swimming and badminton are my two favourite sports. I'm looking for a partner, so message me if you'd like to join!" },
        { id: "explore", title: "Exploring and learning", art: "compass", text: "I'm always curious about new things and like trying what I've never done before." }
      ]
    },

    life: {
      title: "Activities",
      intro: "A few pieces of my life.",
      items: [
        {
          id: "life-gec",
          title: "With the Global Economics Club",
          text: "I was a member of the club's Communications Team: writing posts, designing posters and planning the whole G'Contest campaign.",
          media: "gec",
          cover: "gec-gcontest.jpg"
        },
        {
          id: "life-events",
          title: "Volunteering at events",
          text: "I supported the Mid-Autumn event \"Trẩy hội trăng rằm\" and a seminar of the Faculty of International Economics.",
          art: "moon"
        },
        {
          id: "life-moments",
          title: "Everyday moments",
          text: "A few photos from my ordinary days.",
          media: "moments",
          cover: "life-3.jpg"
        }
      ]
    },

    contact: {
      titleRecruiter: "Contact",
      titleOther: "Say hi",
      introRecruiter: "Want to talk about an opportunity? Send me a few lines and I'll reply soon.",
      introOther: "Want to say hi, hang out, or play badminton together? Message me!",
      showPhone: "Show phone number",
      channels: { linkedin: "LinkedIn: Emma Phùng", facebook: "Facebook", email: "Email", phone: "Phone" },
      form: {
        name: "Full name",
        email: "Email",
        facebook: "Facebook (link or name)",
        phone: "Phone number (optional)",
        message: "Message",
        send: "Send message",
        sending: "Sending…",
        sent: "Sent. Thank you, I'll reply soon!",
        failed: "Couldn't send. Please try again later, or reach me through LinkedIn or Email.",
        mailto: "Your email app will open with the details filled in. Press send to finish.",
        subjectRecruiter: "Recruiter message via portfolio",
        subjectOther: "Message from portfolio"
      }
    }
  }
};
