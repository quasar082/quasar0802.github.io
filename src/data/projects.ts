import 'server-only';

export interface Project {
  slug: string;
  title: string;
  titleVi: string;
  description: string;
  descriptionVi: string;
  tags: string[];
  thumbnail: string;
  links: {
    live?: string;
    github?: string;
    paper?: string;
  };
  featured: boolean;
  caseStudy: {
    challenge: string;
    challengeVi: string;
    solution: string;
    solutionVi: string;
    screenshots: string[];
  };
}

export const projects: Project[] = [
  {
    slug: 'multi-agent-orchestrator',
    title: 'Multi-Agent Orchestrator',
    titleVi: 'Nen Tang Dieu Phoi Da Tac Nhan',
    description:
      'A production-grade orchestration platform that coordinates multiple AI agents to solve complex tasks. Agents communicate through a shared message bus, negotiate task allocation, and maintain context across multi-step workflows.',
    descriptionVi:
      'Nen tang dieu phoi cap san xuat phoi hop nhieu tac nhan AI de giai quyet cac tac vu phuc tap. Cac tac nhan giao tiep qua bus tin nhan chung, thuong luong phan bo tac vu, va duy tri ngu canh xuyen suot cac quy trinh nhieu buoc.',
    tags: ['LangGraph', 'FastAPI', 'Redis', 'WebSocket'],
    thumbnail: '/images/projects/project-1.jpg',
    links: {
      live: 'https://demo.example.com/orchestrator',
      github: 'https://github.com/rayquasar18/multi-agent-orchestrator',
    },
    featured: true,
    caseStudy: {
      challenge:
        'Enterprise customers needed a way to chain specialized AI agents for document processing, data extraction, and report generation without manual handoffs. Existing solutions suffered from context loss between steps and lacked observability into agent decision-making.',
      challengeVi:
        'Khach hang doanh nghiep can mot cach de chuoi cac tac nhan AI chuyen biet cho xu ly tai lieu, trich xuat du lieu va tao bao cao ma khong can chuyen giao thu cong. Cac giai phap hien tai bi mat ngu canh giua cac buoc va thieu kha nang quan sat qua trinh ra quyet dinh cua tac nhan.',
      solution:
        'Built a graph-based orchestration engine using LangGraph where each agent is a node with typed inputs/outputs. A central coordinator routes tasks based on agent capabilities and load. Redis Streams handle inter-agent messaging with guaranteed delivery. The platform includes a real-time dashboard showing agent states, message flows, and execution traces.',
      solutionVi:
        'Xay dung mot dong co dieu phoi dua tren do thi su dung LangGraph, trong do moi tac nhan la mot node voi dau vao/dau ra co kieu. Mot bo dieu phoi trung tam dinh tuyen tac vu dua tren kha nang va tai cua tac nhan. Redis Streams xu ly truyen tin giua tac nhan voi dam bao gui. Nen tang bao gom bang dieu khien thoi gian thuc hien thi trang thai tac nhan, luong tin nhan va vet thuc thi.',
      screenshots: [
        '/images/projects/orchestrator-1.jpg',
        '/images/projects/orchestrator-2.jpg',
      ],
    },
  },
  {
    slug: 'rag-knowledge-base',
    title: 'RAG Knowledge Base',
    titleVi: 'Co So Tri Thuc RAG',
    description:
      'An intelligent knowledge retrieval system that combines vector search with structured metadata filtering. Supports multi-modal documents, automatic chunking strategies, and citation-grounded responses with confidence scoring.',
    descriptionVi:
      'He thong truy xuat tri thuc thong minh ket hop tim kiem vector voi loc sieu du lieu co cau truc. Ho tro tai lieu da phuong thuc, chien luoc chia khuc tu dong, va phan hoi co trich dan voi diem tin cay.',
    tags: ['LangChain', 'Pinecone', 'Next.js', 'OpenAI'],
    thumbnail: '/images/projects/project-2.jpg',
    links: {
      live: 'https://demo.example.com/knowledge-base',
      github: 'https://github.com/rayquasar18/rag-knowledge-base',
    },
    featured: true,
    caseStudy: {
      challenge:
        'A research team with thousands of technical papers needed instant, accurate answers grounded in their corpus. Standard keyword search missed semantic relationships, and generic LLMs hallucinated facts not present in the source material.',
      challengeVi:
        'Mot nhom nghien cuu voi hang ngan bai bao ky thuat can cau tra loi tuc thi, chinh xac dua tren kho du lieu cua ho. Tim kiem tu khoa thong thuong bo sot cac moi quan he ngu nghia, va cac LLM chung tu tao ra cac su kien khong co trong tai lieu goc.',
      solution:
        'Designed a RAG pipeline with hybrid retrieval: dense vector embeddings via OpenAI plus sparse BM25 for keyword precision. Documents are chunked using a recursive strategy that preserves section boundaries. Responses include inline citations with page numbers, and a confidence score calibrated against known question-answer pairs.',
      solutionVi:
        'Thiet ke mot pipeline RAG voi truy xuat lai: embedding vector day du qua OpenAI ket hop BM25 thu cho do chinh xac tu khoa. Tai lieu duoc chia khuc bang chien luoc de quy giu nguyen ranh gioi phan. Phan hoi bao gom trich dan noi dong voi so trang, va diem tin cay duoc hieu chinh dua tren cac cap cau hoi-tra loi da biet.',
      screenshots: [
        '/images/projects/rag-1.jpg',
        '/images/projects/rag-2.jpg',
      ],
    },
  },
  {
    slug: 'sentiment-analysis-api',
    title: 'Real-Time Sentiment Analysis API',
    titleVi: 'API Phan Tich Cam Xuc Thoi Gian Thuc',
    description:
      'A high-throughput sentiment analysis service processing thousands of social media posts per second. Features aspect-level sentiment, emotion detection, and sarcasm handling with custom fine-tuned transformer models.',
    descriptionVi:
      'Dich vu phan tich cam xuc thong luong cao xu ly hang ngan bai dang mang xa hoi moi giay. Bao gom phan tich cam xuc cap khia canh, phat hien cam xuc, va xu ly mai mia voi cac mo hinh transformer tinh chinh tuy chinh.',
    tags: ['Transformers', 'FastAPI', 'Kafka', 'Docker'],
    thumbnail: '/images/projects/project-3.jpg',
    links: {
      github: 'https://github.com/rayquasar18/sentiment-analysis-api',
      paper: 'https://arxiv.org/abs/example',
    },
    featured: false,
    caseStudy: {
      challenge:
        'A marketing analytics platform needed to process real-time social media streams and extract nuanced sentiment beyond simple positive/negative classification. The existing rule-based system missed sarcasm, mixed sentiments, and domain-specific language.',
      challengeVi:
        'Mot nen tang phan tich tiep thi can xu ly luong mang xa hoi thoi gian thuc va trich xuat cam xuc tinh te vuot xa phan loai tich cuc/tieu cuc don gian. He thong dua tren quy tac hien tai bo sot mai mia, cam xuc hon hop, va ngon ngu chuyen nganh.',
      solution:
        'Fine-tuned a DeBERTa-v3 model on a custom dataset with aspect-level sentiment annotations. The API ingests messages from Kafka topics, runs batched inference on GPU, and publishes enriched events back. Includes an emotion taxonomy (joy, anger, surprise, etc.) and a sarcasm detection head trained on Twitter irony datasets.',
      solutionVi:
        'Tinh chinh mo hinh DeBERTa-v3 tren tap du lieu tuy chinh voi chu thich cam xuc cap khia canh. API tiep nhan tin nhan tu cac topic Kafka, chay suy luan theo lo tren GPU, va xuat ban cac su kien da lam giau tro lai. Bao gom phan loai cam xuc (vui, gian, ngac nhien, v.v.) va dau phat hien mai mia duoc huan luyen tren tap du lieu mai mia Twitter.',
      screenshots: [
        '/images/projects/sentiment-1.jpg',
        '/images/projects/sentiment-2.jpg',
      ],
    },
  },
];
