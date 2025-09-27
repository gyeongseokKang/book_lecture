export default function SafariPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-gray-600 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Safari 사용자 감지!
          </h1>
          <p className="text-gray-600">
            사파리 브라우저로 접속하신 것을 감지했습니다.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              Safari 전용 기능
            </h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 최적화된 성능</li>
              <li>• 향상된 개인정보 보호</li>
              <li>• 에너지 효율성</li>
              <li>• 네이티브 앱 경험</li>
            </ul>
          </div>

          <div className="flex space-x-3">
            <a
              href="/dashboard"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              대시보드로 이동
            </a>
            <a
              href="/"
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              홈으로 돌아가기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
