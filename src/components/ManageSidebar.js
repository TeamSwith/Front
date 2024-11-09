import React from 'react';
import editIcon from "../assets/edit.png";
import trashIcon from "../assets/Trash.png";

const ManageSidebar = ({ activeTab, setActiveTab, progressPercentage, tasks, handleCheckboxChange }) => {
  return (

    <div className="flex flex-col w-full flex-grow">

        <div className="flex space-x-8 w-fit border-b border-gray-300 mb-4">
            <button
            onClick={() => setActiveTab('schedule')}
            className={`text-lg font-semibold pb-2 ${
              activeTab === 'schedule' ? 'text-[#8CC29E] border-b-2 border-[#8CC29E]' : 'text-gray-500'
            }`}
            >
              Schedule
            </button>
            <button
              onClick={() => setActiveTab('information')}
              className={`text-lg font-semibold pb-2 ${
              activeTab === 'information' ? 'text-[#8CC29E] border-b-2 border-[#8CC29E]' : 'text-gray-500'
            }`}
          >
              Information
            </button>
          </div>
    

        <div className="bg-[#F7F9F2] flex-grow p-6 rounded-lg shadow-lg mb-4 md:mb-0 mt-4 md:mt-0">

          

          {activeTab === 'schedule' ? (


        <div>
          <h2 className="text-lg font-semibold text-[#4B4B4B] mb-4 flex justify-between">
            XXXX.XX.XX Study Schedule
            <div className="flex space-x-3">
              <img src={editIcon} alt="Edit Icon" className="w-6 h-6 cursor-pointer" />
              <img src={trashIcon} alt="Trash Icon" className="w-6 h-6 cursor-pointer" />
            </div>
          </h2>
          <hr className="border-t-[2px] border-gray-300 mb-4" />
          <p className="text-[#4B4B4B] mb-3">
            시간:
          </p>
          <p className="text-[#4B4B4B] mb-4">
            장소:
          </p>
          <hr className="border-t-[2px] border-gray-300 mb-2" />
          <div className="p-6">
            {/* 과제 텍스트와 게이지 바 컨테이너 */}
            <div className="flex items-center mb-4 space-x-4">
              <p className="text-lg text-[#4B4B4B] mr-4">과제</p>
              <div className="w-[200px] h-4 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#8CC29E] rounded-full transition-width duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              <span className="text-[#5B5B5B]">
                {Math.round(progressPercentage)}%
              </span>

            </div>
            {/* 체크박스 리스트 */}
            <div>
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center mb-2.5">
                  <input
                    type="checkbox"
                    checked={task.checked}
                    onChange={() => handleCheckboxChange(task.id)}
                    className="mr-2"
                  />
                  <label className="text-[#4B4B4B]">{task.label}</label>
                </div>
              ))}
            </div>
          </div>
          <hr className="border-t-[2px] border-gray-300 mb-4" />

          <p className="text-[#4B4B4B] mb-4">
            Task Feedback
          </p>
            <div className="flex items-center mb-2">
                <textarea
                type="text"
                className="flex-grow border border-gray-300 rounded-lg p-3 h-20 resize-none overflow-auto"
                placeholder="댓글을 입력하세요"
                //value={newComment}
                //onChange={(e) => setNewComment(e.target.value)}
                />
            </div>
            <div className="flex justify-end">
                <button
                    //onClick={handleAddComment}
                    className="bg-[#8CC29E] text-white text-[14px] px-4 py-1.5 rounded-lg"
                    >
                    등록
                </button>
            </div>
        </div>

        ) : (
          // Information 탭 내용
          <div>
            <h2 className="text-xl text-[#4B4B4B] mb-4">
              C++의 황제가 될 거야
            </h2>
            <hr className="border-t-[2px] border-gray-300 mb-4" />
            <p className="text-[#4B4B4B] mb-5">
              스터디 아이디 |
            </p>
            <p className="text-[#4B4B4B] mb-5">
              스터디 기간 |
            </p>
            <p className="text-[#4B4B4B] mb-5 cursor-pointer">
              소통 수단 |
            </p> {/* 하이퍼링크 */}
            <p className="text-[#4B4B4B] mb-4">
              XXXX.XX.XX에 생성된 스터디
            </p>
            <hr className="border-t-[2px] border-gray-300 mb-4" />
            <p className="text-lg text-[#4B4B4B] mb-5">
              스터디원
            </p>
          </div>
        )}

        </div>

        </div>
        );
    };
    
    export default ManageSidebar;