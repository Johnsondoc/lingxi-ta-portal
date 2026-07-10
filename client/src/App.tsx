import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ClassAssignments from "./pages/ClassAssignments";
import Homework from "./pages/Homework";
import PublishTask from "./pages/PublishTask";
import StudentProfile from "./pages/StudentProfile";
import Messages from "./pages/Messages";
import CourseLibrary from "./pages/CourseLibrary";
import GradingProgress from "./pages/GradingProgress";
import CohortAnalysis from "./pages/CohortAnalysis";
import ParentCommunication from "./pages/ParentCommunication";
import ClassAnnouncements from "./pages/ClassAnnouncements";
import WorkLog from "./pages/WorkLog";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/dashboard">
        {() => (
          <DashboardLayout>
            <Switch>
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/class-assignments" component={ClassAssignments} />
              <Route path="/homework" component={Homework} />
              <Route path="/publish-task" component={PublishTask} />
              <Route path="/student-profile" component={StudentProfile} />
              <Route path="/messages" component={Messages} />
              <Route path="/course-library" component={CourseLibrary} />
              <Route path="/grading-progress" component={GradingProgress} />
              <Route path="/cohort-analysis" component={CohortAnalysis} />
              <Route path="/parent-communication" component={ParentCommunication} />
              <Route path="/class-announcements" component={ClassAnnouncements} />
              <Route path="/work-log" component={WorkLog} />
              <Route path="/404" component={NotFound} />
              <Route component={NotFound} />
            </Switch>
          </DashboardLayout>
        )}
      </Route>
      <Route path="/">
        {() => { window.location.replace("/login"); return null; }}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
