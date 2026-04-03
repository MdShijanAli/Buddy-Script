import StorySection from "./StorySection";
import PostForm from "./PostForm";
import TimeLinePosts from "./TimeLinePosts";

export default function FeedMiddle() {
  return (
    <div className="_layout_middle_wrap">
      <div className="_layout_middle_inner">
        <div className="_feed_inner_ppl_card _mar_b16">
          <div className="_feed_inner_story_arrow">
            <button type="button" className="_feed_inner_story_arrow_btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="9"
                height="8"
                fill="none"
                viewBox="0 0 9 8"
              >
                <path
                  fill="#fff"
                  d="M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 010-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z"
                />
              </svg>
            </button>
          </div>
          <StorySection />
        </div>

        <PostForm />

        <TimeLinePosts />
      </div>
    </div>
  );
}
