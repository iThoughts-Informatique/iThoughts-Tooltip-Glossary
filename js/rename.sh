for file in $(find . -name '*.js'); do
    if [[ $file =~ ithoughts_tooltip_glossary.* ]]; then
	if ! [[ $file =~ \.min\.js ]]; then
	    filebase=$(echo "$file" | sed -re 's/^.*((ithoughts.*)\.js)$/\1/g')
	    filenoext=$(echo "$file" | sed -re 's/^.*(ithoughts.*?)\.js$/\1/g')
	    targetfile=${filenoext//ithoughts_tooltip_glossary/ithoughts_tt_gl}
	    echo "$filebase $filenoext $targetfile"
	    find ../ -type f -print0 | xargs -0 sed 's:\/'$filenoext':/'$targetfile':g' $filebase
	fi
    fi
done
