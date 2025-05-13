import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const isInvitationRoute = location.pathname.includes("/undangan");

  // Log error
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Auto redirect after countdown
  useEffect(() => {
    if (countdown <= 0) {
      navigate("/", { replace: true });
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-retirement-light p-4">
      <div className="text-center max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">404 - Halaman Tidak Ditemukan</h1>

        {isInvitationRoute ? (
          <p className="text-gray-600 mb-6">
            Maaf, undangan yang Anda cari tidak ditemukan atau telah dihapus.
            Hal ini mungkin terjadi karena:
          </p>
        ) : (
          <p className="text-gray-600 mb-6">
            Maaf, halaman yang Anda cari tidak ditemukan.
          </p>
        )}

        {isInvitationRoute && (
          <ul className="text-left text-gray-600 mb-6 list-disc pl-5">
            <li>Tamu telah dihapus dari daftar undangan</li>
            <li>Link undangan yang Anda gunakan tidak valid</li>
            <li>Terjadi kesalahan dalam penulisan nama tamu</li>
          </ul>
        )}

        <p className="text-gray-600 mb-6">
          Anda akan dialihkan ke halaman utama dalam <span className="font-bold">{countdown}</span> detik.
        </p>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate("/")}
            className="w-full"
          >
            Kembali ke Halaman Utama
          </Button>

          {isInvitationRoute && (
            <Button
              onClick={() => navigate("/undangan")}
              variant="outline"
              className="w-full"
            >
              Lihat Undangan Umum
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
