export default function Loading() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar placeholder */}
      <div className="hidden lg:block w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-10 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header placeholder */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-5 py-3.5">
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Main content placeholder */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 sm:p-6">
            {/* Page title placeholder */}
            <div className="mb-8">
              <div className="h-8 bg-gray-200 rounded w-64 animate-pulse mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
            </div>

            {/* Tabs placeholder */}
            <div className="mb-6">
              <div className="flex space-x-8 border-b border-gray-200">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-gray-200 rounded w-32 animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* Events grid placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg border border-gray-200 p-6"
                >
                  <div className="h-48 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                    <div className="flex items-center space-x-4 pt-2">
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
