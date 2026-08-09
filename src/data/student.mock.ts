export const MOCK_STUDENT_PROFILE = {
  id: "student-001",
  fullName: "Kwame Mensah",
  email: "kwame@university.edu",
  institution: "University of Ghana",
  department: "Computer Science",
  level: "Level 300",
  verified: true,
  avatarUrl: "",
};

export const MOCK_DASHBOARD_COURSES = [
  {
    id: "cs301",
    code: "CS301",
    title: "Software Engineering",
    lecturer: "Dr. Ama Boateng",
    resources: 24,
    status: "Active",
    progress: 72,
    semester: "First Semester",
  },
  {
    id: "cs305",
    code: "CS305",
    title: "Database Systems",
    lecturer: "Prof. Kofi Mensah",
    resources: 18,
    status: "Active",
    progress: 54,
    semester: "First Semester",
  },
  {
    id: "cs311",
    code: "CS311",
    title: "Artificial Intelligence",
    lecturer: "Dr. Nana Owusu",
    resources: 31,
    status: "Archived",
    progress: 100,
    semester: "Previous Semester",
  },
];

export const MOCK_RECENT_RESOURCES = [
  {
    id: "doc-001",
    title: "Software Architecture Notes",
    course: "CS301",
    type: "PDF",
    uploadedBy: "Dr. Ama Boateng",
    time: "2 hours ago",
  },
  {
    id: "doc-002",
    title: "Database Normalization Slides",
    course: "CS305",
    type: "SLIDE",
    uploadedBy: "Prof. Kofi Mensah",
    time: "Yesterday",
  },
  {
    id: "doc-003",
    title: "AI Past Examination",
    course: "CS311",
    type: "EXAM",
    uploadedBy: "Dr. Nana Owusu",
    time: "3 days ago",
  },
];

export const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    title: "New course material uploaded",
    message: "CS301 Software Architecture Notes",
    unread: true,
  },
  {
    id: "n2",
    title: "Semester archive available",
    message: "Previous semester resources are ready",
    unread: true,
  },
];
