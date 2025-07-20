const ReusablePriorityPage = ({ priority }: Props) => {
  const [view, setView] = useState("list");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  const { data: currentUser, isLoading: isAuthLoading } = useGetAuthUserQuery({});
  const userId = currentUser?.userDetails?.userId;

  const {
    data: tasks,
    isLoading: isTasksLoading,
    isError: isTasksError,
    error: tasksError,
  } = useGetTasksByUserQuery(userId ?? 0, {
    skip: !userId,
  });

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const filteredTasks = tasks?.filter((task: Task) => task.priority === priority) || [];

  if (isAuthLoading || (!userId && !isTasksLoading)) {
    return <div>Loading user...</div>;
  }

  if (isTasksError) {
    console.error("Error fetching tasks:", tasksError);
    return <div>Error fetching tasks. Please check the console for details.</div>;
  }

  return (
    <div className="m-5 p-4">
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
      />
      <Header
        name="Priority Page"
        buttonComponent={
          <button
            className="mr-3 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Add Task
          </button>
        }
      />
      <div className="mb-4 flex justify-start">
        <button
          className={`px-4 py-2 ${view === "list" ? "bg-gray-300" : "bg-white"} rounded-l`}
          onClick={() => setView("list")}
        >
          List
        </button>
        <button
          className={`px-4 py-2 ${view === "table" ? "bg-gray-300" : "bg-white"} rounded-l`}
          onClick={() => setView("table")}
        >
          Table
        </button>
      </div>

      {isTasksLoading ? (
        <div>Loading tasks...</div>
      ) : view === "list" ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task: Task) => <TaskCard key={task.id} task={task} />)
          ) : (
            <div>No tasks found with priority: {priority}</div>
          )}
        </div>
      ) : (
        <div className="z-0 w-full">
          <DataGrid
            rows={filteredTasks}
            columns={columns}
            checkboxSelection
            getRowId={(row) => row.id}
            className={dataGridClassNames}
            sx={dataGridSxStyles(isDarkMode)}
          />
        </div>
      )}
    </div>
  );
};
