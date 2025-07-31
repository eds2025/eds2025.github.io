#!/usr/bin/env bash

ROOT_DIR="$( realpath $( dirname "${BASH_SOURCE[0]}" ) )"

optimize_images () {
    directory="$1"
    size="$2"
    format="$3"
    quality="$4"
    input_directory="${ROOT_DIR}/images_orig/${1}"
    output_directory="${ROOT_DIR}/images/${1}"

    if [ ! -d "$input_directory" ]; then
        echo "Input directory $input_directory does not exist. Skipping..."
        return
    fi

    echo "Optimizing images in "$output_directory" ..."
    
    cd "$output_directory"
    GLOBIGNORE="*.svg,*.gitkeep"
    #mogrify -resize ${size}^ -gravity Center -extent ${size} -format ${format} -quality ${quality} *
    mogrify -adaptive-resize ${size}\> -format ${format} -quality ${quality} *
    rm -f *.jpg *.jpeg *.png *.gif
    unset GLOBIGNORE
    cd "$ROOT_DIR"
}


rm -rf "${ROOT_DIR}/images"
cp -r "${ROOT_DIR}/images_orig" "${ROOT_DIR}/images"

# Optimize images of organizers and advisory-board
optimize_images organizing-committee 300x300 jpg 90
# optimize_images advisory-board 300x300 webp 90

# Optimize images of speakers
# optimize_images previous-speakers 300x300 webp 90
optimize_images speakers 600x600 jpg 90
# optimize_images cfc 600x600 webp 90

# Optimize sponsors and partners logos
optimize_images sponsors 600x600 png 90
optimize_images partners-logos 600x600 png 90
optimize_images institutions-logos 600x600 png 90
optimize_images honorary-patronages 600x600 png 90

# Optimize AI-generated images
# optimize_images ai-generated 800x800 webp 90
