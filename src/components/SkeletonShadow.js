import React from "react";
import Skeleton from "@mui/material/Skeleton";

const SkeletonShadow = () => {
  return (
    <div className="container">
      <div className="px-lg-5">
        <div className="row">
          {Array.from(new Array(12)).map((item, index) => (
            <div key={index} className="col-xl-4 col-lg-4 col-md-6 mb-4">
              <div className="box bg-bgColor rounded shadow">
                <Skeleton variant="rectangular" width="100%" height={180} />
                <div className="container-fluid mt-3 px-4">
                  <Skeleton />
                  <Skeleton width="60%" />
                </div>
                <div className="container-fluid mt-1 px-4">
                  <Skeleton width="100%" />
                  <Skeleton width="100%" />
                  <Skeleton width="100%" />
                </div>
                <div className="container-fluid mt-5 mb-4 d-flex justify-content-center">
                  <Skeleton variant="circular" width={40} height={40} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonShadow;
