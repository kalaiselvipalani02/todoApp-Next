import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { Todo } from "../../model/toDo";

const dir_Path = path.join(process.cwd(), "data");
const file_Path = path.join(process.cwd(), "data", "form-data.json");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    //adding filds to schema
    const todo: Todo = {
      id: Date.now(),
      name: body.name,
      desc: body.desc,
      completed: false,
      creadAt: new Date(),
    };
    //getting file path for where to save data, form-data-json is file name. process.cwd() - project root directory
    //const filePath = path.join(process.cwd(), "data", "form-data.json");
    //if directory not present creaate directory
    // const dirPath = path.join(process.cwd(), "data");
    if (!fs.existsSync(dir_Path)) {
      fs.mkdirSync(path.dirname(file_Path), { recursive: true });
    }

    let existingData = [];
    //file already exists, read the content ,parse it JSON array
    if (fs.existsSync(file_Path)) {
      const fileContent = fs.readFileSync(file_Path, "utf-8");
      existingData = JSON.parse(fileContent || "[]");
    }
    //update the new data to that file
    existingData.push(todo);

    //need to write in file
    fs.writeFileSync(file_Path, JSON.stringify(existingData, null, 2));
    //write to samefile with JSON format 2 space indentation.
    return NextResponse.json(
      { message: "Data added successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    if (fs.existsSync(file_Path)) {
      const fileContent = fs.readFileSync(file_Path, "utf-8");
      const data = JSON.parse(fileContent || "[]");
      return NextResponse.json({ data });
    } else {
      return NextResponse.json({ data: [] }, { status: 404 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    //if id is persent delete individual records otherwise delete all
    if (id) {
      if (fs.existsSync(file_Path)) {
        const fileContent = fs.readFileSync(file_Path, "utf-8");
        const parsed = JSON.parse(fileContent);
        let todos = [];

        if (Array.isArray(parsed)) {
          todos = parsed;
        }
        const filteredTodo = todos.filter(
          (todo: Todo) => todo.id.toString() !== id.toString()
        );
        fs.writeFileSync(
          file_Path,
          JSON.stringify( filteredTodo, null, 2),
          "utf-8"
        );
        return NextResponse.json({ success: true });
      }
    } else { //entire data
      if (fs.existsSync(file_Path)) {
        await fs.promises.unlink(file_Path);
      }

      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const idString = url.searchParams.get("id");
  const id = Number(idString);

  try {
    const updatedTodo: Todo = await req.json();
    if (fs.existsSync(file_Path)) {
      const fileContent = fs.readFileSync(file_Path, "utf-8");
      const parsed = JSON.parse(fileContent);
      let todos = [];

      if (Array.isArray(parsed)) {
        todos = parsed;
      } else {
        console.error("Malformed todo file format");
        return NextResponse.json(
          { error: "Invalid file format" },
          { status: 500 }
        );
      }

      const todoIndex = todos.findIndex(
        (todo: Todo) => todo.id.toString() === id.toString()
      );

      if (todoIndex === -1) {
        return NextResponse.json(
          { message: "Todo not found" },
          { status: 404 }
        );
      }

      todos[todoIndex] = { ...todos[todoIndex], ...updatedTodo };

      //const updatedNewTodo = JSON.stringify({ data: todos });

      fs.writeFileSync(file_Path, JSON.stringify(todos, null, 2), "utf-8");
      return NextResponse.json({
        message: "Todo updated",
        todo: todos[todoIndex],
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
