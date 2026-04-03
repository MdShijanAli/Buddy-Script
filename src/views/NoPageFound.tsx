import { useNavigate } from "react-router-dom";
import "../assets/css/common.css";

export default function NoPageFound() {
  const navigate = useNavigate();

  return (
    <div className="_no_page_found_wrapper">
      <div className="_no_page_found_container">
        <div className="_no_page_found_bg_decoration">
          <div className="_decoration_circle _decoration_circle_1"></div>
          <div className="_decoration_circle _decoration_circle_2"></div>
          <div className="_decoration_circle _decoration_circle_3"></div>
        </div>

        <div className="_no_page_found_content">
          <div className="_no_page_found_heading_section">
            <h1 className="_no_page_found_title">404</h1>
            <div className="_no_page_found_animated_line"></div>
          </div>

          <div className="_no_page_found_message_section">
            <h2 className="_no_page_found_subtitle">Page Not Found</h2>
            <p className="_no_page_found_description">
              Oops! The page you're looking for doesn't exist or has been moved.
              Let's get you back on track.
            </p>
          </div>

          <div className="_no_page_found_illustration">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 300 200"
              className="_no_page_illustration_svg"
            >
              <circle
                cx="150"
                cy="100"
                r="80"
                fill="none"
                stroke="#377DFF"
                strokeWidth="3"
              />
              <line
                x1="210"
                y1="160"
                x2="240"
                y2="190"
                stroke="#377DFF"
                strokeWidth="3"
              />
              <text
                x="150"
                y="115"
                fontSize="60"
                fontWeight="bold"
                fill="#377DFF"
                textAnchor="middle"
                className="_no_page_question_mark"
              >
                ?
              </text>
            </svg>
          </div>

          <div className="_no_page_found_actions">
            <button
              className="_no_page_found_btn _no_page_found_btn_primary"
              onClick={() => navigate("/")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 18 18"
              >
                <path
                  fill="#fff"
                  d="M8.293 16.293L.586 8.586a1 1 0 010-1.414l1.414-1.414a1 1 0 011.414 0L8 11.172l5.586-5.586a1 1 0 011.414 0l1.414 1.414a1 1 0 010 1.414l-7.707 7.707a1 1 0 01-1.414 0z"
                />
              </svg>
              Go Back Home
            </button>
            <button
              className="_no_page_found_btn _no_page_found_btn_secondary"
              onClick={() => navigate(-1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="#377DFF"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 12H5m7-7l-7 7 7 7"
                />
              </svg>
              Go Back
            </button>
          </div>
        </div>
      </div>

      <style>{`
        /* 404 Page Styling */
        ._no_page_found_wrapper {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 10px;
          position: relative;
          overflow: hidden;
        }

        ._no_page_found_container {
          position: relative;
          z-index: 1;
          max-width: 550px;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Background Decorations */
        ._no_page_found_bg_decoration {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        ._decoration_circle {
          position: absolute;
          border-radius: 50%;
          opacity: 0.08;
        }

        ._decoration_circle_1 {
          width: 200px;
          height: 200px;
          background: #377DFF;
          top: -80px;
          right: -60px;
          animation: float 6s ease-in-out infinite;
        }

        ._decoration_circle_2 {
          width: 120px;
          height: 120px;
          background: #00d4ff;
          bottom: -40px;
          left: -80px;
          animation: float 8s ease-in-out infinite reverse;
        }

        ._decoration_circle_3 {
          width: 100px;
          height: 100px;
          background: #377DFF;
          bottom: 80px;
          right: 30px;
          animation: float 7s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(15px);
          }
        }

        /* Content */
        ._no_page_found_content {
          background: white;
          border-radius: 15px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
          padding: 30px 25px;
          text-align: center;
          position: relative;
          z-index: 2;
          animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Heading Section */
        ._no_page_found_heading_section {
          margin-bottom: 12px;
        }

        ._no_page_found_title {
          font-size: 70px;
          font-weight: 800;
          margin: 0;
          background: linear-gradient(135deg, #377DFF 0%, #00d4ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -3px;
          margin-bottom: 8px;
          animation: slideDown 0.8s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        ._no_page_found_animated_line {
          width: 50px;
          height: 3px;
          background: linear-gradient(90deg, #377DFF 0%, #00d4ff 100%);
          margin: 0 auto;
          border-radius: 2px;
          animation: expandWidth 1s ease-out;
        }

        @keyframes expandWidth {
          from {
            width: 0;
          }
          to {
            width: 50px;
          }
        }

        /* Message Section */
        ._no_page_found_message_section {
          margin-bottom: 12px;
        }

        ._no_page_found_subtitle {
          font-size: 20px;
          font-weight: 700;
          color: #112032;
          margin: 0 0 6px 0;
          line-height: 1.2;
        }

        ._no_page_found_description {
          font-size: 13px;
          color: #666;
          margin: 0;
          line-height: 1.4;
        }

        /* Illustration */
        ._no_page_found_illustration {
          margin: 12px 0;
          display: flex;
          justify-content: center;
        }

        ._no_page_illustration_svg {
          width: 110px;
          height: 110px;
          animation: rotate 20s linear infinite;
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        ._no_page_question_mark {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        /* Action Buttons */
        ._no_page_found_actions {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-bottom: 0;
          flex-wrap: wrap;
        }

        ._no_page_found_btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          min-width: 120px;
          justify-content: center;
        }

        ._no_page_found_btn svg {
          width: 14px;
          height: 14px;
        }

        ._no_page_found_btn_primary {
          background: linear-gradient(135deg, #377DFF 0%, #1e5cdc 100%);
          color: white;
          box-shadow: 0 6px 15px rgba(55, 125, 255, 0.3);
        }

        ._no_page_found_btn_primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(55, 125, 255, 0.4);
        }

        ._no_page_found_btn_primary:active {
          transform: translateY(-1px);
        }

        ._no_page_found_btn_secondary {
          background: transparent;
          color: #377DFF;
          border: 2px solid #377DFF;
        }

        ._no_page_found_btn_secondary:hover {
          background: rgba(55, 125, 255, 0.05);
          transform: translateY(-2px);
        }

        ._no_page_found_btn_secondary:active {
          transform: translateY(-1px);
        }

        /* Support Link */
        ._no_page_found_support {
          padding-top: 12px;
          border-top: 1px solid #eee;
        }

        ._no_page_found_support_text {
          font-size: 12px;
          color: #666;
          margin: 0;
        }

        ._no_page_found_support_link {
          color: #377DFF;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        ._no_page_found_support_link:hover {
          color: #1e5cdc;
          text-decoration: underline;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          ._no_page_found_content {
            padding: 20px 18px;
          }

          ._no_page_found_title {
            font-size: 50px;
            letter-spacing: -2px;
          }

          ._no_page_found_subtitle {
            font-size: 16px;
          }

          ._no_page_found_description {
            font-size: 12px;
          }

          ._no_page_illustration_svg {
            width: 90px;
            height: 90px;
          }

          ._no_page_found_actions {
            flex-direction: row;
            gap: 8px;
          }

          ._no_page_found_btn {
            width: auto;
            min-width: 100px;
            padding: 8px 12px;
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          ._no_page_found_wrapper {
            padding: 8px;
          }

          ._no_page_found_content {
            padding: 18px 12px;
            border-radius: 12px;
          }

          ._no_page_found_title {
            font-size: 45px;
            letter-spacing: -2px;
            margin-bottom: 5px;
          }

          ._no_page_found_heading_section {
            margin-bottom: 8px;
          }

          ._no_page_found_message_section {
            margin-bottom: 8px;
          }

          ._no_page_found_subtitle {
            font-size: 15px;
            margin-bottom: 4px;
          }

          ._no_page_found_description {
            font-size: 11px;
          }

          ._no_page_found_illustration {
            margin: 8px 0;
          }

          ._no_page_illustration_svg {
            width: 80px;
            height: 80px;
          }

          ._no_page_found_btn {
            padding: 8px 12px;
            font-size: 11px;
            min-width: 90px;
            gap: 4px;
          }

          ._no_page_found_btn svg {
            width: 12px;
            height: 12px;
          }
        }
      `}</style>
    </div>
  );
}
