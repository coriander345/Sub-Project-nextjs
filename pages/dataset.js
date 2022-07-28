import Layout from "../components/layout/default/layout-default";
import Seo from "../components/common/seo";
import Bucket from "../api/bucket";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import randomColor from "randomcolor";

export default function Dataset({ container, query }) {
  const buckets = container.data;
  const { bucket: queryBucket, object: queryObject } = query;

  const [selectedBucket, setSelectedBucket] = useState("");
  const [selectedObject, setSelectedObject] = useState("");
  const [objects, setObjects] = useState([]);
  const [versions, setVersions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [clickedVersion, setClickedVersion] = useState(false);
  const [clickedClasses, setClickcedClasses] = useState(false);

  const handleBucketClick = async (bucketName) => {
    if (selectedBucket === bucketName) return;
    const objects = await new Bucket().gets(bucketName);
    setObjects(objects.data);
    setSelectedBucket(bucketName);
    setVersions([]);
    setClasses([]);
    setClickedVersion(false);
    setClickcedClasses(false);
    setSelectedObject("");
  };

  const handleObjectVersionClick = (_versions, versionID) => {
    setVersions(_versions);
    setSelectedObject(versionID);
    setClickedVersion(true);
    setClickcedClasses(false);
    setClasses([]);
  };

  const handleObjectClassesClick = (_classes, versionID) => {
    setClasses(_classes);
    setSelectedObject(versionID);
    setClickcedClasses(true);
    setClickedVersion(false);
    setVersions([]);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if (!selectedBucket.length || selectedBucket === queryBucket) {
      if (
        queryBucket &&
        buckets.find((bucket) => bucket.name === queryBucket)
      ) {
        await handleBucketClick(queryBucket);
      }
      if (
        queryObject &&
        objects.find((object) => object.name === queryObject)
      ) {
        const [object] = objects.filter(
          (object) => object.name === queryObject
        );
        setSelectedObject(object.VersionID);
        handleObjectClassesClick(object.classes_infos, object.VersionID);
      }
    }
  }, [selectedBucket]);

  const Buckets = ({ bucket }) => {
    const selected = selectedBucket === bucket.name;
    return (
      <>
        <li
          onClick={() => handleBucketClick(bucket.name)}
          className={`__bucket ${selected ? "selected" : ""}`}
        >
          <div>{bucket.name}</div>
        </li>
        <style jsx>{`
          li.__bucket {
            list-style: none;
            padding: 15px 25px;
            font-size: 14px;
            line-height: 21px;
            border: 1px solid transparent;

            &:first-child {
              border-radius: 5px 0 0 0;
            }

            &.selected {
              > div {
                font-weight: 700;
                color: #639eff;
              }
            }

            &:hover {
              cursor: pointer;
            }
          }
        `}</style>
      </>
    );
  };

  const Objects = ({ objects }) => {
    const object = objects.map((_object) => {
      const selected = _object.VersionID === selectedObject;
      const clickedVersionButton =
        selected && clickedVersion ? "clicked-version" : "";
      const clickedClassesButton =
        selected && clickedClasses ? "clicked-classes" : "";
      return (
        <React.Fragment key={_object.VersionID}>
          <li className={`__object ${selected ? "selected" : ""} `}>
            <p>{_object.name}</p>
            <div className="__object-buttons">
              <button
                type="button"
                className={clickedVersionButton}
                onClick={() =>
                  handleObjectVersionClick(_object.versions, _object.VersionID)
                }
              >
                Version
                {clickedVersionButton.length ? (
                  <Image
                    src="/icon/ChevronRightGrey.svg"
                    alt="chevron grey"
                    width={9}
                    height={9}
                  />
                ) : (
                  <Image
                    src="/icon/ChevronRight.svg"
                    alt="chevron"
                    width={9}
                    height={9}
                  />
                )}
              </button>
              <button
                type="button"
                className={clickedClassesButton}
                onClick={() =>
                  handleObjectClassesClick(
                    _object.classes_infos,
                    _object.VersionID
                  )
                }
              >
                Classes
                {clickedClassesButton.length ? (
                  <Image
                    src="/icon/ChevronRightGrey.svg"
                    alt="chevron grey"
                    width={9}
                    height={9}
                  />
                ) : (
                  <Image
                    src="/icon/ChevronRight.svg"
                    alt="chevron"
                    width={9}
                    height={9}
                  />
                )}
              </button>
            </div>
          </li>
          <style jsx>{`
            li.__object {
              list-style: none;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 15px 25px;
              border: 1px solid transparent;
              border-bottom: 1px solid #3f4262;
              position: relative;

              &:before {
                content: "";
                position: absolute;
                width: 25px;
                bottom: -1px;
                left: -1px;
                height: 1px;
                background-color: #1d1e2c;
              }

              &:after {
                content: "";
                position: absolute;
                width: 25px;
                bottom: -1px;
                right: -1px;
                height: 1px;
                background-color: #1d1e2c;
              }

              &.selected {
                background: #24263a;
                border: 1px solid #3e82f1;
                border-right: 1px solid transparent;

                &:before {
                  display: none;
                }

                &:after {
                  display: none;
                }
              }

              > p {
                font-size: 14px;
                line-height: 21px;
              }

              div.__object-buttons {
                display: flex;
                flex-direction: column;
                gap: 5px;
                justify-content: center;

                > button {
                  width: 70px;
                  height: 28px;
                  border-radius: 20px;
                  color: #fff;
                  background-color: #3761a6;
                  border: 0;
                  font-size: 12px;
                  line-height: 18px;

                  &.clicked-version,
                  &.clicked-classes {
                    background-color: #171825;
                    color: #8a8c9b;
                  }

                  &:hover {
                    cursor: pointer;
                  }
                }
              }
            }
          `}</style>
        </React.Fragment>
      );
    });
    return object;
  };

  const VersionIDs = ({ versions }) => {
    const versionID = versions.map((_version) => {
      return (
        <React.Fragment key={_version.VersionID}>
          <li key={_version.VersionID} className="__version">
            <p>{_version.VersionID}</p>
          </li>
          <style jsx>{`
            li.__version {
              list-style: none;
              > p {
                font-size: 12px;
                line-height: 18px;
                margin-bottom: 15px;
              }
            }
          `}</style>
        </React.Fragment>
      );
    });
    return versionID;
  };

  const RenderClasses = ({ classes }) => {
    const renderClass = classes.map((_class, idx) => {
      const style = {backgroundColor: randomColor()};
      return (
        <React.Fragment key={idx}>
          <li className="__class" style={style}>
            <div className="__class-box">
              <div className="__class-name">{_class.name}</div>
              <div className="__class-count">{_class.count}</div>
            </div>
          </li>
          <style jsx>{`
            li.__class {
              flex: auto;
              border-radius: 20px;
              display: inline-block;;
              justify-content: center;
              align-items: center;
              margin: 5px;
              
              .__class-box {
               display: flex;
               padding: 0 10px;
               mix-blend-mode: difference;

                .__class-name {
                  padding: 6px 12px;
                  font-size: 12px;
                  line-height: 18px;
                }

                .__class-count {
                  font-size: 14px;
                  line-height: 28px;
                }
              }
          
            }
          `}</style>
        </React.Fragment>
      );
    });
    return renderClass;
  };

  const showProperties = clickedClasses
    ? "__show-properties"
    : "" || clickedVersion
    ? "__show-properties"
    : "";

  return (
    <>
      <article className="__container">
        <div className="__title">Datasets</div>
        <section className="__dataset-box">
          <ul className="__buckets">
            {buckets.map((bucket) => (
              <Buckets bucket={bucket} key={bucket.creationDate} />
            ))}
          </ul>
          <ul className="__objects">
            <Objects objects={objects} />
          </ul>
          <ul className={`__properties ${showProperties}`}>
            {versions.length ? (
              <VersionIDs versions={versions} />
            ) : (
              <RenderClasses classes={classes} />
            )}
          </ul>
        </section>
      </article>
      <style jsx>{`
        .__container {
          width: 100%;
          height: 100%;
          padding: 50px 100px 0;
        }

        div.__title {
          color: #a0a3c2;
          font-size: 14px;
          line-height: 21px;
          margin-bottom: 10px;
        }

        .__dataset-box {
          display: flex;
          border: 1px solid #3f4262;
          border-radius: 5px;
          width: 100%;
          height: 90%;
        }

        .__buckets {
          flex: 2;
          overflow-y: auto;
          border-right: 1px solid #3f4262;
        }

        .__objects {
          flex: 5;
          overflow-y: auto;
          border-right: 1px solid #3f4262;
        }

        .__properties {
          flex-wrap: wrap;
          flex: 3;
          overflow-y: auto;
          padding: 25px;
          border: 0;
          list-style: none;
          display: inline;

          &.__show-properties {
            border: 1px solid #3e82f1;
            background-color: #24263a;
            border-radius: 0 5px 5px 0;
          }
        }
      `}</style>
    </>
  );
}

Dataset.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Seo title="Model" />
      {page}
    </Layout>
  );
};

export async function getServerSideProps({ query }) {
  // Instead of fetching your `/api` route you can call the same
  // function directly in `getStaticProps`
  const container = await new Bucket().gets();
  return { props: { container, query } };
}
