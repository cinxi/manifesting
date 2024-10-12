//admin-dashboard.js

document.addEventListener('DOMContentLoaded', function() {
    // Determine the current page
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'admin-dashboard.html') {
        initializeCalendar();
    }

    if (currentPage === 'user-management.html') {
        initializeUserManagement();
    }

    /**
     * Function to initialize the custom calendar
     */
    function initializeCalendar() {
        const calendarBody = document.getElementById('calendarBody');
        const currentMonthYear = document.getElementById('currentMonthYear');
        const prevMonthBtn = document.getElementById('prevMonth');
        const nextMonthBtn = document.getElementById('nextMonth');

        let today = new Date();
        let currentMonth = today.getMonth();
        let currentYear = today.getFullYear();

        const events = [
            { date: '2024-04-10', title: 'Appointment with John Doe' },
            { date: '2024-04-15', title: 'Vaccination Drive' },
            { date: '2024-04-20', title: 'Appointment with Jane Smith' }
            // Add more events as needed
        ];

        function renderCalendar(month, year) {
            calendarBody.innerHTML = '';
            currentMonthYear.textContent = `${getMonthName(month)} ${year}`;

            // First day of the month
            const firstDay = new Date(year, month, 1).getDay();

            // Number of days in the month
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            // Previous month's days
            const prevMonthDays = new Date(year, month, 0).getDate();

            // Calculate total cells needed (6 weeks)
            const totalCells = 6 * 7;
            let dayCounter = 1;
            let nextMonthDayCounter = 1;

            for (let i = 0; i < totalCells; i++) {
                const row = Math.floor(i / 7);
                if (i % 7 === 0) {
                    calendarBody.appendChild(document.createElement('tr'));
                }

                const cell = document.createElement('td');

                if (i < firstDay) {
                    // Previous month's dates
                    const prevDay = prevMonthDays - firstDay + i + 1;
                    cell.innerHTML = `<span class="text-muted">${prevDay}</span>`;
                } else if (dayCounter > daysInMonth) {
                    // Next month's dates
                    cell.innerHTML = `<span class="text-muted">${nextMonthDayCounter++}</span>`;
                } else {
                    // Current month's dates
                    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayCounter).padStart(2, '0')}`;
                    cell.innerHTML = `<span class="day-number">${dayCounter}</span>`;

                    // Check for events on this day
                    const dayEvents = events.filter(event => event.date === dateString);
                    dayEvents.forEach(event => {
                        const eventDiv = document.createElement('div');
                        eventDiv.classList.add('event');
                        eventDiv.textContent = event.title;
                        cell.appendChild(eventDiv);
                    });

                    // Add click event to open event details (optional)
                    cell.addEventListener('click', function() {
                        if (dayEvents.length > 0) {
                            let eventDetails = dayEvents.map(event => event.title).join('\n');
                            alert(`Events on ${dateString}:\n${eventDetails}`);
                        } else {
                            alert(`No events on ${dateString}.`);
                        }
                    });

                    dayCounter++;
                }

                calendarBody.querySelector('tr:last-child').appendChild(cell);
            }
        }

        function getMonthName(monthIndex) {
            const monthNames = [
                'January', 'February', 'March',
                'April', 'May', 'June',
                'July', 'August', 'September',
                'October', 'November', 'December'
            ];
            return monthNames[monthIndex];
        }

        // Initial render
        renderCalendar(currentMonth, currentYear);


        // Event listeners for navigation buttons
        prevMonthBtn.addEventListener('click', function() {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar(currentMonth, currentYear);
        });

        nextMonthBtn.addEventListener('click', function() {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar(currentMonth, currentYear);
        });
    }

      
    /**
     * Function to initialize User Management functionalities
     */
    function initializeUserManagement() {
        // Modal Elements
        const addUserForm = document.getElementById('addUserForm');
        const editUserForm = document.getElementById('editUserForm');

        // Handle Add User Form Submission
        addUserForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const username = document.getElementById('new-username').value.trim();
            const email = document.getElementById('new-email').value.trim();
            const role = document.getElementById('new-role').value;

            if (username === '' || email === '' || role === '') {
                alert('Please fill in all fields.');
                return;
            }

            // Create a new table row
            const tbody = document.querySelector('.users-table tbody');
            const tr = document.createElement('tr');

            // Username
            const usernameTd = document.createElement('td');
            usernameTd.textContent = username;
            tr.appendChild(usernameTd);

            // Email
            const emailTd = document.createElement('td');
            emailTd.textContent = email;
            tr.appendChild(emailTd);

            // Role
            const roleTd = document.createElement('td');
            roleTd.textContent = role;
            tr.appendChild(roleTd);

            // Actions
            const actionsTd = document.createElement('td');

            // Edit Button
            const editBtn = document.createElement('button');
            editBtn.classList.add('btn', 'btn-primary', 'btn-sm', 'edit-btn', 'me-2');
            editBtn.innerHTML = '<i class="fas fa-edit me-1"></i> Edit';
            editBtn.setAttribute('data-bs-toggle', 'modal');
            editBtn.setAttribute('data-bs-target', '#editUserModal');
            actionsTd.appendChild(editBtn);

            // Delete Button
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'delete-btn');
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt me-1"></i> Delete';
            actionsTd.appendChild(deleteBtn);

            tr.appendChild(actionsTd);

            tbody.appendChild(tr);

            // Reset the form and close the modal
            addUserForm.reset();
            const addUserModal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
            addUserModal.hide();
        });

        // Handle Edit User Form Submission
        editUserForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const username = document.getElementById('edit-username').value.trim();
            const email = document.getElementById('edit-email').value.trim();
            const role = document.getElementById('edit-role').value;

            if (username === '' || email === '' || role === '') {
                alert('Please fill in all fields.');
                return;
            }

            // Get the row being edited
            const row = editUserForm.getAttribute('data-edit-row');
            if (row) {
                row.children[0].textContent = username;
                row.children[1].textContent = email;
                row.children[2].textContent = role;
            }

            // Reset the form and close the modal
            editUserForm.reset();
            const editUserModal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
            editUserModal.hide();
        });

        // Handle Edit Button Clicks
        document.querySelectorAll('.edit-btn').forEach(function(button) {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const username = row.children[0].textContent;
                const email = row.children[1].textContent;
                const role = row.children[2].textContent;

                document.getElementById('edit-username').value = username;
                document.getElementById('edit-email').value = email;
                document.getElementById('edit-role').value = role;

                // Store the row being edited
                const editUserForm = document.getElementById('editUserForm');
                editUserForm.setAttribute('data-edit-row', row);
            });
        });

        // Handle Delete Button Clicks
        document.querySelectorAll('.delete-btn').forEach(function(button) {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const username = row.children[0].textContent;

                if (confirm(`Are you sure you want to delete user: ${username}?`)) {
                    row.remove();
                }
            });
        });

        // Update event listeners for dynamically added Edit and Delete buttons
        const usersTable = document.querySelector('.users-table tbody');
        usersTable.addEventListener('click', function(event) {
            if (event.target.closest('.edit-btn')) {
                const button = event.target.closest('.edit-btn');
                const row = button.closest('tr');
                const username = row.children[0].textContent;
                const email = row.children[1].textContent;
                const role = row.children[2].textContent;

                document.getElementById('edit-username').value = username;
                document.getElementById('edit-email').value = email;
                document.getElementById('edit-role').value = role;

                // Store the row being edited
                const editUserForm = document.getElementById('editUserForm');
                editUserForm.setAttribute('data-edit-row', row);
            }

            if (event.target.closest('.delete-btn')) {
                const button = event.target.closest('.delete-btn');
                const row = button.closest('tr');
                const username = row.children[0].textContent;

                if (confirm(`Are you sure you want to delete user: ${username}?`)) {
                    row.remove();
                }
            }
        });
    }
});