import cardPP11Image from "../assets/images/card_ppl1.png";
import cardPP12Image from "../assets/images/card_ppl2.png";
import cardPP13Image from "../assets/images/card_ppl3.png";
import cardPP14Image from "../assets/images/card_ppl4.png";
import miniPicImage from "../assets/images/mini_pic.png";

export default function StorySection() {
  return (
    <div className="row">
      <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col">
        <div className="_feed_inner_profile_story _b_radious6 ">
          <div className="_feed_inner_profile_story_image">
            <img
              src={cardPP11Image}
              alt="Image"
              className="_profile_story_img"
            />
            <div className="_feed_inner_story_txt">
              <div className="_feed_inner_story_btn">
                <button className="_feed_inner_story_btn_link">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    fill="none"
                    viewBox="0 0 10 10"
                  >
                    <path
                      stroke="#fff"
                      strokeLinecap="round"
                      d="M.5 4.884h9M4.884 9.5v-9"
                    />
                  </svg>
                </button>
              </div>
              <p className="_feed_inner_story_para">Your Story</p>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col">
        <div className="_feed_inner_public_story _b_radious6">
          <div className="_feed_inner_public_story_image">
            <img
              src={cardPP12Image}
              alt="Image"
              className="_public_story_img"
            />
            <div className="_feed_inner_pulic_story_txt">
              <p className="_feed_inner_pulic_story_para">Ryan Roslansky</p>
            </div>
            <div className="_feed_inner_public_mini">
              <img
                src={miniPicImage}
                alt="Image"
                className="_public_mini_img"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 _custom_mobile_none">
        <div className="_feed_inner_public_story _b_radious6">
          <div className="_feed_inner_public_story_image">
            <img
              src={cardPP13Image}
              alt="Image"
              className="_public_story_img"
            />
            <div className="_feed_inner_pulic_story_txt">
              <p className="_feed_inner_pulic_story_para">Ryan Roslansky</p>
            </div>
            <div className="_feed_inner_public_mini">
              <img
                src={miniPicImage}
                alt="Image"
                className="_public_mini_img"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 _custom_none">
        <div className="_feed_inner_public_story _b_radious6">
          <div className="_feed_inner_public_story_image">
            <img
              src={cardPP14Image}
              alt="Image"
              className="_public_story_img"
            />
            <div className="_feed_inner_pulic_story_txt">
              <p className="_feed_inner_pulic_story_para">Ryan Roslansky</p>
            </div>
            <div className="_feed_inner_public_mini">
              <img
                src={miniPicImage}
                alt="Image"
                className="_public_mini_img"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
