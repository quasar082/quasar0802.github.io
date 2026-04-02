import 'server-only';

export type AchievementCategory = 'award' | 'education' | 'experience';

export interface Achievement {
  id: string;
  category: AchievementCategory;
  year: string;
  title: string;
  titleVi: string;
  organization: string;
  organizationVi: string;
  description?: string;
  descriptionVi?: string;
}

export const CATEGORY_ORDER: AchievementCategory[] = ['award', 'education', 'experience'];

export const achievements: Achievement[] = [
  // Awards
  {
    id: 'award-1',
    category: 'award',
    year: '2024',
    title: 'Best AI Innovation Award',
    titleVi: 'Giai thuong Doi moi AI Xuat sac',
    organization: 'Vietnam AI Summit',
    organizationVi: 'Hoi nghi AI Viet Nam',
    description:
      'Recognized for developing a multi-agent orchestration platform that reduced enterprise workflow processing time by 60%.',
    descriptionVi:
      'Duoc ghi nhan vi phat trien nen tang dieu phoi da tac nhan giup giam 60% thoi gian xu ly quy trinh doanh nghiep.',
  },
  {
    id: 'award-2',
    category: 'award',
    year: '2023',
    title: 'Outstanding Research Paper',
    titleVi: 'Bai Nghien cuu Xuat sac',
    organization: 'AAAI Conference',
    organizationVi: 'Hoi nghi AAAI',
    description:
      'Published research on efficient retrieval-augmented generation for low-resource languages.',
    descriptionVi:
      'Xuat ban nghien cuu ve tao sinh tang cuong truy xuat hieu qua cho cac ngon ngu it tai nguyen.',
  },
  // Education
  {
    id: 'edu-1',
    category: 'education',
    year: '2022 - 2024',
    title: 'Master of Science in Artificial Intelligence',
    titleVi: 'Thac si Khoa hoc Tri tue Nhan tao',
    organization: 'Ho Chi Minh City University of Technology',
    organizationVi: 'Dai hoc Bach Khoa TP.HCM',
    description:
      'Focused on natural language processing and multi-agent systems. Thesis on cooperative agent communication protocols.',
    descriptionVi:
      'Tap trung vao xu ly ngon ngu tu nhien va he thong da tac nhan. Luan van ve giao thuc giao tiep tac nhan hop tac.',
  },
  {
    id: 'edu-2',
    category: 'education',
    year: '2018 - 2022',
    title: 'Bachelor of Engineering in Computer Science',
    titleVi: 'Cu nhan Ky thuat Khoa hoc May tinh',
    organization: 'Ho Chi Minh City University of Technology',
    organizationVi: 'Dai hoc Bach Khoa TP.HCM',
    description:
      'Graduated with honors. Senior project on sentiment analysis for Vietnamese social media.',
    descriptionVi:
      'Tot nghiep loai gioi. Do an tot nghiep ve phan tich cam xuc mang xa hoi tieng Viet.',
  },
  // Experience
  {
    id: 'exp-1',
    category: 'experience',
    year: '2024 - Present',
    title: 'AI Engineer',
    titleVi: 'Ky su AI',
    organization: 'TechCorp Vietnam',
    organizationVi: 'TechCorp Viet Nam',
    description:
      'Leading development of LLM-powered automation tools and multi-agent orchestration systems for enterprise clients.',
    descriptionVi:
      'Dan dat phat trien cong cu tu dong hoa su dung LLM va he thong dieu phoi da tac nhan cho khach hang doanh nghiep.',
  },
  {
    id: 'exp-2',
    category: 'experience',
    year: '2022 - 2024',
    title: 'Machine Learning Engineer',
    titleVi: 'Ky su Hoc May',
    organization: 'DataLab Solutions',
    organizationVi: 'DataLab Solutions',
    description:
      'Built and deployed NLP pipelines for document processing, entity extraction, and automated report generation.',
    descriptionVi:
      'Xay dung va trien khai cac pipeline NLP cho xu ly tai lieu, trich xuat thuc the, va tao bao cao tu dong.',
  },
  {
    id: 'exp-3',
    category: 'experience',
    year: '2020 - 2022',
    title: 'Software Developer Intern',
    titleVi: 'Thuc tap sinh Phat trien Phan mem',
    organization: 'FPT Software',
    organizationVi: 'FPT Software',
    description:
      'Developed backend services and REST APIs for e-commerce platforms using Node.js and Python.',
    descriptionVi:
      'Phat trien dich vu backend va REST API cho cac nen tang thuong mai dien tu su dung Node.js va Python.',
  },
];
