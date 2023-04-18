export default function Message({children, avatar, username, description,  }) {
    return (
      <div className="bg-white p-8 border-b-2 rounded-lg">
        <div className="flex items-center gap-2">
          <img src={avatar} className="w-10 rounded-full" />
          <h2 className="text-sm">{username}</h2>
        </div>
        <div className="py-4 ">
          <p className="bg-gray-800 text-cyan-400 w-full rounded-lg p-2">{description}</p>
        </div>
        {children}
      </div>
    );
};