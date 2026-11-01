import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronRight,
  LoaderCircle,
  Menu,
  Search,
  UserRound,
  X,
} from "lucide-react";
import Sidebar from "./Sidebar";
import api from "../../services/api";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [requests, setRequests] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(true);
  const [searchError, setSearchError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  /*
   * Load student's requests for global search.
   */
  useEffect(() => {
    let active = true;

    const loadRequests = async () => {
      try {
        setSearchLoading(true);
        setSearchError("");

        const data = await api.getMyRequests();

        if (!active) {
          return;
        }

        setRequests(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!active) {
          return;
        }

        console.error(
          "Dashboard search request loading failed:",
          err,
        );

        setSearchError(
          err.message || "Unable to load requests.",
        );

        setRequests([]);
      } finally {
        if (active) {
          setSearchLoading(false);
        }
      }
    };

    loadRequests();

    return () => {
      active = false;
    };
  }, []);

  /*
   * Close search dropdown when clicking outside.
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  /*
   * Prevent background scrolling while mobile sidebar is open.
   */
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);


  /*
   * Search requests.
   */
  const filteredRequests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return requests.slice(0, 5);
    }

    return requests
      .filter((request) => {
        return (
          request.requestNumber
            ?.toLowerCase()
            .includes(query) ||
          request.title
            ?.toLowerCase()
            .includes(query) ||
          request.categoryName
            ?.toLowerCase()
            .includes(query) ||
          request.location
            ?.toLowerCase()
            .includes(query) ||
          request.status
            ?.toLowerCase()
            .includes(query)
        );
      })
      .slice(0, 8);
  }, [requests, searchQuery]);

  const handleRequestSelect = (request) => {
    setSearchQuery("");
    setSearchOpen(false);

    navigate(`/student/requests/${request.id}`);
  };

  const getStatusLabel = (status) => {
    if (!status) {
      return "";
    }

    return status.replaceAll("_", " ");
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      {/* Sidebar */}
      <Sidebar
        mobileOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main */}
      <div className="min-w-0 flex-1">
        <header className="flex min-h-20 items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-10">
          {/* Left side */}
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              aria-expanded={sidebarOpen}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500">
                Student Workspace
              </p>

              <h2 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                UniServe-Ruhuna
              </h2>
            </div>
          </div>

          {/* Right side */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            {/* Search */}
            <div
              ref={searchRef}
              className="relative hidden md:block"
            >
              <div
                className={`flex w-64 items-center gap-2 rounded-xl border bg-slate-50 px-4 py-2.5 lg:w-80 ${
                  searchOpen
                    ? "border-blue-400 bg-white ring-4 ring-blue-50"
                    : "border-slate-200"
                }`}
              >
                {searchLoading ? (
                  <LoaderCircle
                    size={17}
                    className="shrink-0 animate-spin text-blue-500"
                  />
                ) : (
                  <Search
                    size={17}
                    className="shrink-0 text-slate-400"
                  />
                )}

                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setSearchOpen(true)}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setSearchOpen(true);
                  }}
                  placeholder="Search requests"
                  aria-label="Search requests"
                  className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Search dropdown */}
              {searchOpen && (
                <div className="absolute right-0 top-full z-[100] mt-2 w-[calc(100vw-2rem)] max-w-96 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Search Requests
                    </p>
                  </div>

                  {searchLoading && (
                    <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-slate-500">
                      <LoaderCircle
                        size={17}
                        className="animate-spin"
                      />
                      Loading your requests...
                    </div>
                  )}

                  {!searchLoading && searchError && (
                    <div className="px-4 py-6 text-center">
                      <p className="text-sm font-semibold text-red-600">
                        Could not load requests
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {searchError}
                      </p>
                    </div>
                  )}

                  {!searchLoading &&
                    !searchError &&
                    requests.length === 0 && (
                      <div className="px-4 py-8 text-center">
                        <p className="text-sm font-semibold text-slate-700">
                          No requests available
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          No service requests were returned for this
                          account.
                        </p>
                      </div>
                    )}

                  {!searchLoading &&
                    !searchError &&
                    requests.length > 0 &&
                    filteredRequests.length === 0 && (
                      <div className="px-4 py-8 text-center">
                        <Search className="mx-auto h-7 w-7 text-slate-300" />

                        <p className="mt-3 text-sm font-semibold text-slate-700">
                          No matching requests
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Try a request number, title, category, or
                          status.
                        </p>
                      </div>
                    )}

                  {!searchLoading &&
                    !searchError &&
                    filteredRequests.length > 0 && (
                      <div className="max-h-96 overflow-y-auto p-2">
                        {filteredRequests.map((request) => (
                          <button
                            key={request.id}
                            type="button"
                            onClick={() =>
                              handleRequestSelect(request)
                            }
                            className="group flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-slate-50"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                              <Search size={17} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-bold text-slate-800">
                                {request.requestNumber}
                              </p>

                              <p className="mt-0.5 truncate text-sm text-slate-600">
                                {request.title}
                              </p>

                              <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                                <span>
                                  {request.categoryName}
                                </span>

                                {request.status && (
                                  <>
                                    <span>•</span>

                                    <span>
                                      {getStatusLabel(
                                        request.status,
                                      )}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            <ChevronRight
                              size={17}
                              className="text-slate-300 transition group-hover:text-blue-600"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* Notifications */}
            <button
              type="button"
              onClick={() =>
                navigate("/student/notifications")
              }
              aria-label="Notifications"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100"
            >
              <Bell size={21} />
            </button>

            {/* User */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <UserRound size={20} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-10">
          <Outlet key={location.pathname} />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;