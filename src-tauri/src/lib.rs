// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::fs;
use std::path::PathBuf;
use tauri::AppHandle;

#[tauri::command]
fn save_note(app_handle: AppHandle, id: &str, content: &str) -> Result<(), String> {
    let app_dir = app_handle.path_resolver().app_data_dir().unwrap();
    let notes_dir = app_dir.join("notes");
    
    // Create notes directory if it doesn't exist
    if !notes_dir.exists() {
        fs::create_dir_all(&notes_dir).map_err(|e| e.to_string())?;
    }
    
    let file_path = notes_dir.join(format!("{}.json", id));
    fs::write(file_path, content).map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
fn load_notes(app_handle: AppHandle) -> Result<Vec<String>, String> {
    let app_dir = app_handle.path_resolver().app_data_dir().unwrap();
    let notes_dir = app_dir.join("notes");
    
    // Create notes directory if it doesn't exist
    if !notes_dir.exists() {
        fs::create_dir_all(&notes_dir).map_err(|e| e.to_string())?;
        return Ok(Vec::new());
    }
    
    let mut notes = Vec::new();
    
    for entry in fs::read_dir(notes_dir).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        
        if path.is_file() && path.extension().map_or(false, |ext| ext == "json") {
            let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
            notes.push(content);
        }
    }
    
    Ok(notes)
}

#[tauri::command]
fn delete_note(app_handle: AppHandle, id: &str) -> Result<(), String> {
    let app_dir = app_handle.path_resolver().app_data_dir().unwrap();
    let notes_dir = app_dir.join("notes");
    let file_path = notes_dir.join(format!("{}.json", id));
    
    if file_path.exists() {
        fs::remove_file(file_path).map_err(|e| e.to_string())?;
    }
    
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            save_note,
            load_notes,
            delete_note
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
