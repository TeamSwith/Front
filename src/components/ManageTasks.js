import React, { useState } from 'react';

const ManageTasks = ({ onTaskUpdate }) => {
  const [tasks, setTasks] = useState([
    { id: 1, label: '과제 1', checked: false },
    { id: 2, label: '과제 2', checked: false },
    { id: 3, label: '과제 3', checked: false },
    { id: 4, label: '과제 4', checked: false },
  ]);

  // 체크박스 상태 변경 함수
  const handleCheckboxChange = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, checked: !task.checked } : task
    );
    setTasks(updatedTasks);

    // 부모 컴포넌트에 업데이트된 과제 상태 전달
    onTaskUpdate(updatedTasks);
  };

  // 체크된 항목의 비율 계산
  const checkedCount = tasks.filter((task) => task.checked).length;
  const totalTasks = tasks.length;
  const progressPercentage = (checkedCount / totalTasks) * 100;

  return (
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
        <span className="text-[#5B5B5B]">{Math.round(progressPercentage)}%</span>
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
  );
};

export default ManageTasks;