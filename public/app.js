const altitude = document.querySelector('#altitude');
const altitudeOutput = document.querySelector('#altitudeOutput');
const speedOutput = document.querySelector('#speedOutput');
const periodOutput = document.querySelector('#periodOutput');
const meaningOutput = document.querySelector('#meaningOutput');
const resetButton = document.querySelector('#resetCalculator');

const EARTH_RADIUS = 6371;
const GRAVITATIONAL_PARAMETER = 398600;

function updateOrbit() {
  const height = Number(altitude.value);
  const radius = EARTH_RADIUS + height;
  const speed = Math.sqrt(GRAVITATIONAL_PARAMETER / radius);
  const period = (2 * Math.PI * Math.sqrt((radius ** 3) / GRAVITATIONAL_PARAMETER)) / 60;
  altitudeOutput.textContent = `${height.toLocaleString('zh-CN')} km`;
  speedOutput.textContent = speed.toFixed(2);
  periodOutput.textContent = Math.round(period);
  meaningOutput.textContent = period < 100 ? '快于一节课' : period < 130 ? '大约一节课' : '长于一节课';
}

altitude.addEventListener('input', updateOrbit);
resetButton.addEventListener('click', () => { altitude.value = 550; updateOrbit(); });
updateOrbit();

const missionMessages = {
  a: '你选择了“观察”。这会把故事带向写作：从一朵云开始，练习用细节让远方变得具体。',
  b: '你选择了“意义”。很棒！人文问题会追问：谁在出发？谁会收到消息？技术如何服务更多人？',
  c: '你选择了“测量”。数字是很好的起点；下一步，可以问问这些数字会怎样改变一个人的决定。',
};

document.querySelectorAll('[data-choice]').forEach((choice) => {
  choice.addEventListener('click', () => {
    document.querySelectorAll('[data-choice]').forEach((button) => button.classList.remove('selected'));
    choice.classList.add('selected');
    const result = document.querySelector('#missionResult');
    result.textContent = missionMessages[choice.dataset.choice];
    result.classList.add('success');
  });
});
