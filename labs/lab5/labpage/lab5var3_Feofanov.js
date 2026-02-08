document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const modal = document.getElementById('success-modal');
    const restartBtn = document.getElementById('restart-btn');
    const draggables = document.querySelectorAll('.draggable');

    const correctGroups = {
        mammals: ['cat', 'dog'],
        insects: ['ladybug', 'grasshopper', 'dragonfly'],
        birds: ['chicken', 'parrot']
    };

    const correctRotations = {
        cat: 90,
        dog: 270,
        ladybug: 270,
        grasshopper: 180,
        dragonfly: 0,
        chicken: 270,
        parrot: 180
    };

    const GROUP_DISTANCE = 150;

    const rotations = {};

    draggables.forEach(el => {
        rotations[el.id] = 0;
    });

    const initialPositions = {};
    draggables.forEach(el => {
        initialPositions[el.id] = {
            left: el.style.left,
            top: el.style.top
        };
    });

    const allAngles = [0, 90, 180, 270];
    draggables.forEach(el => {
        const wrongAngles = allAngles.filter(a => a !== correctRotations[el.id]);
        const randomAngle = wrongAngles[Math.floor(Math.random() * wrongAngles.length)];
        rotations[el.id] = randomAngle;
        el.style.transform = `rotate(${randomAngle}deg)`;
    });

    let currentDraggable = null;
    let offsetX = 0;
    let offsetY = 0;

    draggables.forEach(draggable => {
        draggable.addEventListener('mousedown', startDrag);
        draggable.addEventListener('contextmenu', rotateElement);
    });

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);

    function startDrag(e) {
        if (e.button !== 0) return;

        currentDraggable = e.currentTarget;
        currentDraggable.classList.add('dragging');

        const rect = currentDraggable.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        draggables.forEach(el => el.style.zIndex = '1');
        currentDraggable.style.zIndex = '1000';
    }

    function drag(e) {
        if (!currentDraggable) return;

        const canvasRect = canvas.getBoundingClientRect();
        let newX = e.clientX - canvasRect.left - offsetX;
        let newY = e.clientY - canvasRect.top - offsetY;

        const elemRect = currentDraggable.getBoundingClientRect();
        const maxX = canvasRect.width - elemRect.width;
        const maxY = canvasRect.height - elemRect.height;

        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        currentDraggable.style.left = newX + 'px';
        currentDraggable.style.top = newY + 'px';
    }

    function endDrag() {
        if (!currentDraggable) return;

        currentDraggable.classList.remove('dragging');
        currentDraggable = null;

        checkGrouping();
    }

    function rotateElement(e) {
        e.preventDefault();

        const element = e.currentTarget;
        const id = element.id;

        rotations[id] = (rotations[id] + 90) % 360;

        element.classList.add('rotating');
        element.style.transform = `rotate(${rotations[id]}deg)`;

        setTimeout(() => {
            element.classList.remove('rotating');
        }, 300);

        checkGrouping();
    }

    function getCenter(element) {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    function getDistance(p1, p2) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }

    function areGrouped(ids) {
        for (const id of ids) {
            if (rotations[id] !== correctRotations[id]) {
                return false;
            }
        }

        const elements = ids.map(id => document.getElementById(id));

        for (let i = 0; i < elements.length; i++) {
            for (let j = i + 1; j < elements.length; j++) {
                const center1 = getCenter(elements[i]);
                const center2 = getCenter(elements[j]);
                const distance = getDistance(center1, center2);

                if (distance > GROUP_DISTANCE) {
                    return false;
                }
            }
        }
        return true;
    }

    function areGroupsSeparated() {
        const allGroups = Object.values(correctGroups);

        for (let i = 0; i < allGroups.length; i++) {
            for (let j = i + 1; j < allGroups.length; j++) {
                for (const id1 of allGroups[i]) {
                    for (const id2 of allGroups[j]) {
                        const el1 = document.getElementById(id1);
                        const el2 = document.getElementById(id2);
                        const center1 = getCenter(el1);
                        const center2 = getCenter(el2);
                        const distance = getDistance(center1, center2);

                        if (distance <= GROUP_DISTANCE) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    function checkGrouping() {
        draggables.forEach(el => el.classList.remove('grouped'));

        let allGroupsCorrect = true;

        for (const [groupName, ids] of Object.entries(correctGroups)) {
            if (areGrouped(ids)) {
                ids.forEach(id => {
                    document.getElementById(id).classList.add('grouped');
                });
            } else {
                allGroupsCorrect = false;
            }
        }

        if (allGroupsCorrect && areGroupsSeparated()) {
            showSuccessAnimation();
        }
    }

    function showSuccessAnimation() {
        createConfetti();

        setTimeout(() => {
            modal.classList.remove('hidden');
        }, 500);
    }

    function createConfetti() {
        const colors = ['#EBCFB4', '#F4E1CB', '#FAEED6', '#2ecc71', '#3498db', '#e74c3c', '#f39c12', '#9b59b6'];

        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * window.innerWidth + 'px';
                confetti.style.top = '-10px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
                confetti.style.width = (Math.random() * 10 + 5) + 'px';
                confetti.style.height = (Math.random() * 10 + 5) + 'px';

                document.body.appendChild(confetti);

                setTimeout(() => confetti.remove(), 3000);
            }, i * 30);
        }
    }

    restartBtn.addEventListener('click', () => {
        modal.classList.add('hidden');

        draggables.forEach(el => {
            el.classList.remove('grouped');
        });

        shufflePositions();
    });

    function shufflePositions() {
        const canvasRect = canvas.getBoundingClientRect();
        const angles = [0, 90, 180, 270];

        draggables.forEach(el => {
            const maxX = canvasRect.width - 150;
            const maxY = canvasRect.height - 180;

            const newX = Math.random() * maxX;
            const newY = Math.random() * maxY;

            el.style.left = newX + 'px';
            el.style.top = newY + 'px';

            const wrongAngles = angles.filter(a => a !== correctRotations[el.id]);
            const randomAngle = wrongAngles[Math.floor(Math.random() * wrongAngles.length)];
            rotations[el.id] = randomAngle;
            el.style.transform = `rotate(${randomAngle}deg)`;
        });
    }
});