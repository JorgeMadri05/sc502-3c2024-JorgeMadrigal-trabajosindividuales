

document.addEventListener('DOMContentLoaded', function () {
    const tasks = [
        { id: 1, title: "Complete project report", 
            description: "Prepare and submit the project report", 
            dueDate: "2024-12-01" 
        },
        { id: 2, title: "Team Meeting", 
            description: "Get ready for the season", 
            dueDate: "2024-12-01" 
        },
        { id: 3, title: "Code Review", 
            description: "Check partners code", 
            dueDate: "2024-12-01," 
        }
    ];

    function loadTasks() {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';

        tasks.forEach(task => {
            const taskCard = document.createElement('div');
            taskCard.className = 'col-md-4 mb-3';
            taskCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${task.title}</h5>
                    <p class="card-text">${task.description}</p>
                    <p class="card-text"><small class="text-muted">Due: ${task.dueDate}</small></p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-secondary btn-sm edit-task" data-id="${task.id}">Editar</button>
                    <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">Eliminar</button>
                    <button class="btn btn-primary btn-sm add-comentario" data-id="${task.id}" data-bs-toggle="modal" data-bs-target="#comentariosModal">Agregar Comentario</button>
                </div>
                <div class="card-footer">
                    <div id="comentarios-list-${task.id}"></div>
                </div>
            </div>`;
            taskList.appendChild(taskCard);
            loadComentarios(task.id);
        });

        document.querySelectorAll('.edit-task').forEach(button => {
            button.addEventListener('click', handleEditTask);
        });

        document.querySelectorAll('.delete-task').forEach(button => {
            button.addEventListener('click', handleDeleteTask);
        });

        document.querySelectorAll('.add-comentario').forEach(button => {
            button.addEventListener('click', handleAddComentario);
        });
    }
    // Esta funcion se encargara de acargar los datos de comentarios usando GET
    async function loadComentarios(taskId) {
        const comentariosLista = document.getElementById(`comentarios-list-${taskId}`);
        comentariosLista.innerHTML = '';
    
        try {
            // Se envía el task_id en la URL
            const response = await fetch(`api.php?task_id=${taskId}`);
            const data = await response.json();
            const comentarios = data.comments;
    
            if (comentarios.length === 0) {
                const empty = document.createElement("p");
                empty.className = "text-center";
                empty.textContent = "No hay comentarios";
                comentariosLista.appendChild(empty);
                return;
            }
    
            comentarios.forEach(comentario => {
                const comentarioItem = document.createElement('div');
                comentarioItem.className = 'comentario-item';
                comentarioItem.innerHTML = `
                    <div class="d-flex justify-content-between">
                        <p id="comentarioText-${comentario.id_comentario}">${comentario.texto}</p>
                        <div>
                            <button class="btn btn-warning btn-sm edit-comentario" data-id="${comentario.id_comentario}" data-task-id="${taskId}">Editar</button>
                            <button class="btn btn-danger btn-sm delete-comentario" data-id="${comentario.id_comentario}">Eliminar</button>
                        </div>
                    </div>`;
    
                comentariosLista.appendChild(comentarioItem);
            });
    
            document.querySelectorAll('.edit-comentario').forEach(button => {
                button.addEventListener('click', () =>
                    openEditComentarioModal(button.dataset.id, taskId)
                );
            });
    
            document.querySelectorAll('.delete-comentario').forEach(button => {
                button.addEventListener('click', () =>
                    deleteComentario(button.dataset.id, taskId)
                );
            });
    
        } catch (error) {
            console.error("Error:", error);
        }
    }
    function openEditComentarioModal(comentarioId, taskId) {
        const comentarioTextElement = document.getElementById(`comentarioText-${comentarioId}`);
        const oldText = comentarioTextElement.textContent;
    
        document.getElementById("edit-comentario-id").value = comentarioId;
        document.getElementById("edit-comentario-text").value = oldText;
    
        // Guardar el taskId para la actualización
        document.getElementById("edit-comentario-text").dataset.taskId = taskId;
    
        const modal = new bootstrap.Modal(document.getElementById("editComentarioModal"));
        modal.show();
    }


    document.getElementById('guardarEditComentario').addEventListener('click', async function () {
        const comentarioId = document.getElementById("edit-comentario-id").value;
        const taskId = document.getElementById("edit-comentario-text").dataset.taskId;
        const newText = document.getElementById("edit-comentario-text").value.trim();
    
        if (newText === "") {
            alert("El comentario no puede estar vacío.");
            return;
        }
    
        try {
            const response = await fetch('api.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_comentario: comentarioId, texto: newText })
            });
    
            const data = await response.json();
    
            if (data.success) {
                loadComentarios(taskId);
                bootstrap.Modal.getInstance(document.getElementById('editComentarioModal')).hide();
            } else {
                console.error("Error al actualizar comentario:", data.message);
            }
    
        } catch (error) {
            console.error("Error:", error);
        }
    });

    //Agregar los comentarios con POST
    document.getElementById('comentario-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const taskId = document.getElementById('comentario-task-id').value;
        const comentarioText = document.getElementById('comentarioText').value.trim();

        if (comentarioText !== "") {
            await fetch('api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_tarea: taskId, texto: comentarioText })
            });

            document.getElementById('comentarioText').value = "";
            loadComentarios(taskId);
        }

        bootstrap.Modal.getInstance(document.getElementById('comentariosModal')).hide();
    });

    function handleAddComentario(event) {
        const taskId = event.target.dataset.id;
        document.getElementById('comentario-task-id').value = taskId;
    }
    // Elimina con DELETE
    async function deleteComentario(comentarioId, taskId) {
        await fetch('api.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id_comentario=${comentarioId}`
        });

        loadComentarios(taskId);
    }
    // NO TOCAR
    function handleEditTask(event) {
        const taskId = parseInt(event.target.dataset.id);
        const task = tasks.find(t => t.id === taskId);

        if (task) {
            document.getElementById('task-id').value = task.id;
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-desc').value = task.description;
            document.getElementById('due-date').value = task.dueDate;

            const modal = new bootstrap.Modal(document.getElementById('taskModal'));
            modal.show();
        }
    }

    // MO TOCAR
    function handleDeleteTask(event) {
        const taskId = parseInt(event.target.dataset.id);
        const taskIndex = tasks.findIndex(t => t.id === taskId);

        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            loadTasks();
        }
    }

    // NO TOCAR
    document.getElementById('task-form').addEventListener('submit', function (e) {
        e.preventDefault();

        let taskId = document.getElementById('task-id').value;
        const taskTitle = document.getElementById('task-title').value;
        const taskDesc = document.getElementById('task-desc').value;
        const dueDate = document.getElementById('due-date').value;

        if (taskId) {
            const taskIndex = tasks.findIndex(t => t.id === parseInt(taskId));
            tasks[taskIndex] = { id: parseInt(taskId), title: taskTitle, description: taskDesc, dueDate: dueDate };
        } else {
            const newTask = { id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1, title: taskTitle, description: taskDesc, dueDate: dueDate };
            tasks.push(newTask);
        }

        document.getElementById('task-id').value = '';
        e.target.reset();

        loadTasks();
        bootstrap.Modal.getInstance(document.getElementById('taskModal')).hide();
    });
    loadTasks();
    
});

