import { useEffect, useState } from 'react';

import { getGPTReview, getPortfolioReview } from '@/apis/worker/PortfolioApi';
import PortfolioReview from '@/components/worker/detail/review/PortfolioReview';
import { PortfolioDetail, usePortfolioStore } from '@/stores/portfolioStore';
import MannerTemperature from '@components/worker/detail/review/MannerTemperature';

interface Props {
  portfolio: PortfolioDetail;
}
export default function WorkerReview({ portfolio }: Props) {
  const [goodReview, setGoodReview] = useState<string>('');
  const [badReview, setBadReview] = useState<string>('');
  const { portfolioReview, setPortfolioReview, portfolioOverview } =
    usePortfolioStore();
  const fetchPortfolioReview = async (portfolioSerial: number) => {
    const response = await getPortfolioReview(portfolioSerial);
    setPortfolioReview(response.data.data);
  };
  const fetchGptReview = async (portfolioSerial: number) => {
    const response = await getGPTReview(portfolioSerial);
    setGoodReview(response.data.data.goodReview);
    setBadReview(response.data.data.badReview);
  };
  useEffect(() => {
    if (portfolio) {
      fetchPortfolioReview(portfolio.portfolioSerial);
      fetchGptReview(portfolio.portfolioSerial);
    }
  }, []);
  return (
    <>
      <div className="flex flex-col h-full gap-6 py-4 mb-[5rem]">
        {portfolioReview ? (
          <>
            <MannerTemperature
              scores={[
                portfolioReview?.workerTemperature,
                portfolioReview?.averageProfessionalStar,
                portfolioReview?.averageCommunicationStar,
                portfolioReview?.averageQualityStar,
                portfolioReview?.averageAttitudeStar,
              ]}
            />
            <div className="flex flex-col p-3 bg-zp-white drop-shadow-zp-slight rounded-zp-radius-big">
              <div className="flex items-center gap-2 font-bold text-zp-xs">
                {/* <FaRegSmile size={16} /> */}
                <p className="font-bold text-zp-sm">
                  😀 {portfolioOverview?.user.userName}님의 이런 점이 좋아요!
                </p>
              </div>
              <p className="px-2 mt-3 font-bold text-zp-xs text-wrap">
                {goodReview || '아직 좋은 리뷰가 없습니다.'}
              </p>
            </div>
            <div className="flex flex-col p-3 bg-zp-white drop-shadow-zp-slight rounded-zp-radius-big">
              <div className="flex items-center gap-2 font-bold text-zp-xs">
                {/* <FaRegSadTear size={16} /> */}
                <p className="font-bold text-zp-sm">
                  😥 {portfolioOverview?.user.userName}님, 이 부분을 좀더
                  신경써주세요!
                </p>
              </div>
              <p className="px-2 mt-3 font-bold text-zp-xs text-wrap">
                {badReview || '아직 개선할 리뷰가 없습니다.'}
              </p>
            </div>
            <div className="flex flex-col p-3 bg-zp-white drop-shadow-zp-slight rounded-zp-radius-big">
              <p className="font-bold text-zp-sm">💬 리뷰</p>
              {portfolioReview?.reviewList &&
                portfolioReview.reviewList.map((review) => (
                  <PortfolioReview review={review} />
                ))}
            </div>
          </>
        ) : (
          <p className="w-full text-center">
            시공업자의 후기가 존재하지 않습니다.
          </p>
        )}
      </div>
    </>
  );
}
