import { useMediaQuery } from "@mui/material";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import styled from "styled-components";
import "./SlickIntroduce.css";

const settings = {
  autoPlay: true,
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  dotsClass: "slick-dots slick-thumb",
  customPaging: function (i) {
    return <div className="dot"></div>;
  },
};

const DivStyled = styled.div`
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  // display: ${(props) => (props.matches ? "block" : "none")};
`;
const ImgStyled = styled.img`
  width: 40%;
  height: auto;
  margin: 0 auto;
`;

const DivImgStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DivTitle = styled.div`
  font-size: 18px;
  color: #0068ff;
  font-weight: bold;
`;
const DivContent = styled.div`
  max-width: 50%;
  font-size: 14px;
  color: "#001A33";
`;

const DivContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 10px;
`;
export default function SlickIntroduce() {
  const matches = useMediaQuery("(min-width:800px)");
  // console.log(matches);

  if (matches) {
    return (
      <DivStyled style={{}}>
        <div
          style={{
            width: "100%",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: "22px",
                color: "#001A33",
                marginBottom: "10px",
              }}
            >
              Chào mừng đến với <b>Zalo!</b>
            </div>
            <div
              style={{
                width: "40%",
                fontSize: "14px",
                color: "#001A33",
                marginBottom: "40px",
              }}
            >
              Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng người
              thân, bạn bè được tối ưu hoá cho máy tính của bạn.
            </div>
          </div>
          <Slider {...settings}>
            <DivImgStyled>
              <div>
                <ImgStyled
                  src="https://chat.zalo.me/assets/quick-message-onboard.3950179c175f636e91e3169b65d1b3e2.png"
                  alt=""
                />
                <DivContainer>
                  <DivTitle>Nhắn tin nhiều hơn, soạn thảo ít hơn</DivTitle>
                  <DivContent>
                    Sử dụng <b>tin nhắn nhanh</b> để lưu sẵn các tin nhắn thường
                    dùng và gửi nhanh trong hội thoại bất kỳ.
                  </DivContent>
                </DivContainer>
              </div>
            </DivImgStyled>
            <DivImgStyled>
              <div>
                <ImgStyled
                  src="https://chat.zalo.me/assets/inapp-welcome-screen-04.ade93b965a968b16f2203e9d63b283a7.jpg"
                  alt=""
                />
                <DivContainer>
                  <DivTitle>Trải nghiệm xuyên suốt</DivTitle>
                  <DivContent>
                    Kết nối và giải quyết công việc trên mọi thiết bị với dữ
                    liệu luôn được đồng bộ
                  </DivContent>
                </DivContainer>
              </div>
            </DivImgStyled>
            <DivImgStyled>
              <div>
                <ImgStyled
                  src="https://chat.zalo.me/assets/inapp-welcome-screen-02.7f8cab265c34128a01a19f3bcd5f327a.jpg"
                  alt=""
                />
                <DivContainer>
                  <DivTitle>Chát nhóm với đồng đội</DivTitle>
                  <DivContent>
                    Tiện lợi hơn, nhờ các công cụ hỗ trợ chat trên máy tính
                  </DivContent>
                </DivContainer>
              </div>
            </DivImgStyled>
          </Slider>
        </div>
      </DivStyled>
    );
  } else {
    return <></>;
  }
}
