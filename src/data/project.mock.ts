export const MOCK_STUDENT_PROFILE = {
  id: "student-001",
  fullName: "Kwame Mensah",
  email: "kwame@university.edu",
  institution: "University of Ghana",
  department: "Computer Science",
  programme: "BSc Computer Science",
  yearGroup: "2026 Final Year",
  verified: true,
  avatarUrl: "",
};

export const MOCK_PROJECT = {
  id: "project-001",

  title: "AI-Based Student Academic Recommendation System",

  abstract:
    "A system that recommends academic resources and learning paths for university students using machine learning.",

  department: "Computer Science",

  programme: "BSc Computer Science",

  yearGroup: "2026 Final Year",

  student: "Kwame Mensah",

  supervisor: "Dr. Ama Boateng",

  status: "In Progress",

  progress: 65,

  createdAt: "January 2026",

  milestones: [
    {
      id: "m1",
      title: "Project Proposal",
      completed: true,
      date: "January 2026",
    },
    {
      id: "m2",
      title: "Literature Review",
      completed: true,
      date: "February 2026",
    },
    {
      id: "m3",
      title: "System Development",
      completed: false,
      date: "March 2026",
    },
    {
      id: "m4",
      title: "Final Defense",
      completed: false,
      date: "May 2026",
    },
  ],

  documents: [
    {
      id: "doc1",
      title: "Chapter One - Introduction.pdf",
      type: "PDF",
      uploaded: "2 days ago",
    },

    {
      id: "doc2",
      title: "System Architecture Diagram.png",
      type: "IMAGE",
      uploaded: "Yesterday",
    },

    {
      id: "doc3",
      title: "Project Proposal.pdf",
      type: "PDF",
      uploaded: "January 2026",
    },
  ],

  supervisorFeedback: [
    {
      id: "feedback1",
      author: "Dr. Ama Boateng",
      message: "Improve the methodology section with more recent research.",
      date: "Yesterday",
    },
  ],
};

export const MOCK_PROJECTS = [
  {
    id: "project-001",
    title: "AI-Based Student Academic Recommendation System",
    department: "Computer Science",
    yearGroup: "2026 Final Year",
    status: "In Progress",
    student: "Kwame Mensah",
    supervisor: "Dr. Ama Boateng",
  },

  {
    id: "project-002",
    title: "Smart Campus Attendance System",
    department: "Information Technology",
    yearGroup: "2026 Final Year",
    status: "Completed",
    student: "Ama Owusu",
    supervisor: "Dr. Kofi Mensah",
  },

  {
    id: "project-003",
    title: "Mobile Health Monitoring Platform",
    department: "Computer Engineering",
    yearGroup: "2025 Final Year",
    status: "Archived",
    student: "Yaw Asante",
    supervisor: "Dr. Akosua Addo",
  },
];

export const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    title: "Supervisor feedback received",
    message: "Dr. Ama Boateng reviewed Chapter One.",
    unread: true,
  },

  {
    id: "n2",
    title: "Submission deadline updated",
    message: "Final project submission closes May 15.",
    unread: true,
  },
];
