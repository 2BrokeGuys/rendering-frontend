"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Session } from "next-auth";

interface Job {
  job_id: string;
  status: string;
  credits_cost: number;
  created_at: string;
  completed_at: string | null;
  job_type: string;
}

interface RawFile {
  file_name: string;
}

interface OutputFile {
  file_name: string;
  job_id: string;
}

interface ExtendedUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface ExtendedSession extends Session {
  user?: ExtendedUser;
}

export default function Dashboard() {
  const { data: session, status } = useSession() as {
    data: ExtendedSession | null;
    status: "loading" | "authenticated" | "unauthenticated";
  };
  const [activeView, setActiveView] = useState<
    "jobs" | "rawFiles" | "outputFiles"
  >("jobs");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [rawFiles, setRawFiles] = useState<RawFile[]>([]);
  const [outputFiles, setOutputFiles] = useState<OutputFile[]>([]);

  const [isJobsLoading, setIsJobsLoading] = useState(false);
  const [isRawFilesLoading, setIsRawFilesLoading] = useState(false);
  const [isOutputFilesLoading, setIsOutputFilesLoading] = useState(false);

  async function fetchJobs() {
    if (!session?.user?.email) return;

    setIsJobsLoading(true);
    try {
      const response = await fetch(`/api/jobs/${session.user.id}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const { data } = await response.json();
      setJobs(data as Job[]);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      toast.error("Could not load your jobs. Please try again later.");
    } finally {
      setIsJobsLoading(false);
    }
  }

  async function fetchRawFiles() {
    if (!session?.user?.email) return;

    setIsRawFilesLoading(true);
    try {
      const response = await fetch(`/api/files/raw/${session.user.id}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const { data } = await response.json();
      setRawFiles(data as RawFile[]);
    } catch (error) {
      console.error("Failed to fetch raw files:", error);
      toast.error("Could not load your raw files. Please try again later.");
    } finally {
      setIsRawFilesLoading(false);
    }
  }

  async function fetchOutputFiles() {
    if (!session?.user?.email) return;

    setIsOutputFilesLoading(true);
    try {
      const response = await fetch(`/api/files/output/${session.user.id}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const { data } = await response.json();
      setOutputFiles(data as OutputFile[]);
    } catch (error) {
      console.error("Failed to fetch output files:", error);
      toast.error("Could not load your output files. Please try again later.");
    } finally {
      setIsOutputFilesLoading(false);
    }
  }

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) return;

    if (activeView === "jobs") {
      fetchJobs();
    } else if (activeView === "rawFiles") {
      fetchRawFiles();
    } else if (activeView === "outputFiles") {
      fetchOutputFiles();
    }
  }, [activeView, session, status]);

  function handleViewChange(view: "jobs" | "rawFiles" | "outputFiles") {
    setActiveView(view);
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized state
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Not Signed In</h2>
          <p className="text-gray-600 mb-4">
            Please sign in to view your dashboard.
          </p>
          <Button onClick={() => (window.location.href = "/api/auth/signin")}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 border-r">
        <div className="p-5">
          <h1 className="text-xl font-bold mb-6">Dashboard</h1>
          <div className="mb-4">
            <p className="text-sm text-gray-600">Welcome,</p>
            <p className="font-medium">{session?.user?.name}</p>
          </div>
          <nav className="space-y-2">
            <Button
              variant={activeView === "jobs" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleViewChange("jobs")}
            >
              View Jobs
            </Button>
            <Button
              variant={activeView === "rawFiles" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleViewChange("rawFiles")}
            >
              View Raw Files
            </Button>
            <Button
              variant={activeView === "outputFiles" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleViewChange("outputFiles")}
            >
              View Output Files
            </Button>
          </nav>
        </div>
      </div>

      <div className="flex-1 p-8">
        {activeView === "jobs" && (
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">Your Jobs</h2>

            {isJobsLoading ? (
              <div className="p-6 rounded-lg border shadow-sm text-center">
                <p className="text-gray-500">Loading your jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="p-6 rounded-lg border shadow-sm text-center">
                <p className="text-gray-500">
                  You don&apos;t have any jobs yet.
                </p>
              </div>
            ) : (
              <div className="rounded-lg border shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="text-left">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Job ID
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Completed
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                        Credits
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {jobs.map((job) => (
                      <tr key={job.job_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {job.job_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {job.job_type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              job.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : job.status === "failed"
                                  ? "bg-red-100 text-red-800"
                                  : job.status === "processing"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(job.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {job.completed_at
                            ? new Date(job.completed_at).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                          {job.credits_cost} CC
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeView === "rawFiles" && (
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">Your Raw Files</h2>

            {isRawFilesLoading ? (
              <div className="p-6 rounded-lg border shadow-sm text-center">
                <p className="text-gray-500">Loading your raw files...</p>
              </div>
            ) : rawFiles.length === 0 ? (
              <div className="p-6 rounded-lg border shadow-sm text-center">
                <p className="text-gray-500">
                  You don&apos;t have any raw files yet.
                </p>
              </div>
            ) : (
              <div className="rounded-lg border shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
                  {rawFiles.map((file, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-medium">
                            {file.file_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeView === "outputFiles" && (
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">Your Output Files</h2>

            {isOutputFilesLoading ? (
              <div className="p-6 rounded-lg border shadow-sm text-center">
                <p className="text-gray-500">Loading your output files...</p>
              </div>
            ) : outputFiles.length === 0 ? (
              <div className="p-6 rounded-lg border shadow-sm text-center">
                <p className="text-gray-500">
                  You don&apos;t have any output files yet.
                </p>
              </div>
            ) : (
              <div className="rounded-lg border shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        File Name
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Job ID
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {outputFiles.map((file, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          <div className="flex items-center space-x-3">
                            <div className="text-gray-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                              </svg>
                            </div>
                            <span>{file.file_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {file.job_id}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
