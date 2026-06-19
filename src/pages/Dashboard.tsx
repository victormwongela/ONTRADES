import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Monitor,
  FolderKanban,
  Puzzle,
  Rocket,
  Upload,
  Bell,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
  <div className="bg-white rounded-xl shadow-sm min-h-[85vh] p-8">
    
        {/* Header */}

        <div className="flex justify-between items-center mb-12">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Dashboard
            </h1>

            <p className="text-gray-500">
              Load an existing bot or create a new one
            </p>
          </div>

          <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
            <Bell size={18} />
            Announcements
          </button>

        </div>

        {/* Main Section */}

        <div className="text-center">

          <h2 className="text-4xl font-bold text-gray-800">
            Load or build your bot
          </h2>

          <p className="text-gray-500 mt-3">
            Import a bot from your device,
            Google Drive, build one from scratch,
            or use a quick strategy template.
          </p>

        </div>

        {/* Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mt-16">

          {/* My Computer */}

          <label className="cursor-pointer">

            <input
              type="file"
              hidden
              onChange={handleFileUpload}
            />

            <div className="bg-white border rounded-xl h-56 flex flex-col items-center justify-center hover:shadow-lg transition">

              <Monitor
                size={60}
                className="text-blue-600"
              />

              <h3 className="font-semibold text-lg mt-4">
                My Computer
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Upload existing bot
              </p>

            </div>

          </label>

          {/* Google Drive */}

          <div
            onClick={() =>
              alert(
                "Google Drive integration coming soon."
              )
            }
            className="cursor-pointer"
          >
            <div className="bg-white border rounded-xl h-56 flex flex-col items-center justify-center hover:shadow-lg transition">

              <FolderKanban
                size={60}
                className="text-green-600"
              />

              <h3 className="font-semibold text-lg mt-4">
                Google Drive
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Import from Drive
              </p>

            </div>
          </div>

          {/* Bot Builder */}

          <div
            onClick={() =>
              navigate("/bot-builder")
            }
            className="cursor-pointer"
          >
            <div className="bg-white border rounded-xl h-56 flex flex-col items-center justify-center hover:shadow-lg transition">

              <Puzzle
                size={60}
                className="text-purple-600"
              />

              <h3 className="font-semibold text-lg mt-4">
                Bot Builder
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Create custom bots
              </p>

            </div>
          </div>

          {/* Quick Strategy */}

          <div
            onClick={() =>
              navigate("/quick-strategy")
            }
            className="cursor-pointer"
          >
            <div className="bg-white border rounded-xl h-56 flex flex-col items-center justify-center hover:shadow-lg transition">

              <Rocket
                size={60}
                className="text-orange-600"
              />

              <h3 className="font-semibold text-lg mt-4">
                Quick Strategy
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Start instantly
              </p>

            </div>
          </div>

        </div>

        {/* Uploaded File */}

        {selectedFile && (
          <div className="mt-12 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">

            <Upload className="text-green-600" />

            <div>
              <h4 className="font-semibold">
                Bot Imported Successfully
              </h4>

              <p className="text-green-700">
                {selectedFile.name}
              </p>
            </div>

          </div>
        )}

        {/* Recent Activity */}

        <div className="mt-16">

          <h3 className="text-xl font-semibold mb-4">
            Recent Activity
          </h3>

          <div className="bg-gray-50 rounded-xl p-6 text-gray-500">
            No recent activity found.
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;