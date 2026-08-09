import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";

export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainStackParamList = {
  StudentTabs: undefined;
  LecturerTabs: undefined;
  AdminTabs: undefined;

  CourseDetails: { courseId: string };
  CourseArchive: { courseId: string; courseTitle: string };
  EnrollmentFlow: { courseId: string };

  ProjectDetails: { projectId: string };
  ProjectDocuments: { projectId: string };
  ProjectSubmission: { projectId?: string };
  ProjectTimeline: { projectId: string };
  DepartmentProjects: {
    departmentId: string;
    departmentName: string;
  };
  YearGroupProjects: {
    yearGroupId: string;
    yearGroupName: string;
  };

  OrganizationDiscovery: undefined;
  CreateOrganization: undefined;
  VerificationFlow: { organizationId: string };

  Notifications: undefined;
  Settings: undefined;

  AddProject: undefined;

  DocumentViewer: {
    documentId: string;
    courseId?: string;
    projectId?: string;
    title: string;
  };
};

export type StudentTabParamList = {
  StudentHome: undefined;

  StudentProjects: undefined;

  StudentCourses: undefined;

  Search: undefined;

  StudentProfile: undefined;
};

export type LecturerTabParamList = {
  LecturerHome: undefined;

  LecturerProjects: undefined;

  LecturerCourses: undefined;

  LecturerResources: undefined;

  LecturerProfile: undefined;
};

export type AdminTabParamList = {
  AdminHome: undefined;

  AdminProjects: undefined;

  AdminMembers: undefined;

  AdminSettings: undefined;

  AdminProfile: undefined;
};

export type RootScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type MainScreenProps<T extends keyof MainStackParamList> =
  NativeStackScreenProps<MainStackParamList, T>;

export type StudentTabScreenProps<T extends keyof StudentTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<StudentTabParamList, T>,
    NativeStackScreenProps<MainStackParamList>
  >;

export type LecturerTabScreenProps<T extends keyof LecturerTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<LecturerTabParamList, T>,
    NativeStackScreenProps<MainStackParamList>
  >;

export type AdminTabScreenProps<T extends keyof AdminTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<AdminTabParamList, T>,
    NativeStackScreenProps<MainStackParamList>
  >;
