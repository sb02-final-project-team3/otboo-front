import { Avatar, Box, Button, MenuItem, Stack, TextField } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { type ClothesAttributeDefDto, type ClothesDto, ClothesTypeLabel } from '../../types/clothes';
import type { ClothesAttributeWithDefDto } from '../../types/common';

interface Props {
  clothes: ClothesDto;
  attributeDefinitions: ClothesAttributeDefDto[];
  onChange: (clothes: ClothesDto, imageFile?: File) => Promise<void>;
  onCancel?: () => void;
}

export default function ClothesDetailEdit({ clothes, attributeDefinitions, onChange, onCancel }: Props) {
  const deepCopy = useCallback((obj: any) => {
    return JSON.parse(JSON.stringify(obj));
  }, []);

  const [editedClothes, setEditedClothes] = useState<ClothesDto>(deepCopy(clothes));
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    const deepCopiedClothes: ClothesDto = deepCopy(clothes);

    const definedAttributeNames = new Set(
      deepCopiedClothes.attributes.map((a: ClothesAttributeWithDefDto) => a.definitionName),
    );

    const undefinedAttributes = attributeDefinitions
      .filter((attributeDefinition) => !definedAttributeNames.has(attributeDefinition.name))
      .map((attributeDefinition) => ({
        definitionId: attributeDefinition.id,
        definitionName: attributeDefinition.name,
        selectableValues: attributeDefinition.selectableValues,
        value: '',
      }));

    deepCopiedClothes.attributes = [...deepCopiedClothes.attributes, ...undefinedAttributes];

    setEditedClothes(deepCopiedClothes);
  }, [clothes, attributeDefinitions]);

  const handleChange = useCallback(
    (key: keyof ClothesDto, value: any) => {
      setEditedClothes({ ...editedClothes, [key]: value });
    },
    [editedClothes],
  );

  const handleAttributeChange = useCallback(
    (key: string, value: any) => {
      setEditedClothes({
        ...editedClothes,
        attributes: [...editedClothes.attributes.map((a) => (a.definitionName === key ? { ...a, value } : a))],
      });
    },
    [editedClothes],
  );

  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setImageFile(file);
      }
    },
    [editedClothes],
  );

  const handleSubmit = useCallback(async () => {
    const definedAttributes = editedClothes.attributes.filter((a) => a.value !== '');

    await onChange({ ...editedClothes, attributes: definedAttributes }, imageFile);
    setImageFile(undefined);
  }, [editedClothes, imageFile, onChange]);

  const clearChanges = useCallback(() => {
    setEditedClothes(deepCopy(clothes));
  }, [clothes, deepCopy]);

  useEffect(() => {
    return () => {
      clearChanges();
    };
  }, [clearChanges]);

  useEffect(() => {
    if (imageFile) {
      setEditedClothes({ ...editedClothes, imageUrl: URL.createObjectURL(imageFile) });
    }
  }, [imageFile]);

  return (
    <Box>
      <Stack spacing={3} sx={{ maxHeight: '60vh', overflow: 'auto', mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar src={editedClothes.imageUrl} sx={{ width: 100, height: 100, mb: 2 }} />
          <Button variant="outlined" component="label">
            이미지 변경
            <input type="file" hidden onChange={handleImageChange} />
          </Button>
        </Box>
        <TextField
          label="이름"
          name="name"
          value={editedClothes.name}
          onChange={(e) => handleChange('name', e.target.value)}
          fullWidth
          size="small"
        />
        <TextField
          label="종류"
          name="type"
          value={editedClothes.type}
          onChange={(e) => handleChange('type', e.target.value)}
          fullWidth
          select
          size="small"
        >
          {Object.entries(ClothesTypeLabel).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {value}
            </MenuItem>
          ))}
        </TextField>
        {editedClothes.attributes.map((attribute) => (
          <TextField
            key={attribute.definitionId}
            label={attribute.definitionName}
            name={attribute.definitionName}
            value={attribute.value || ''}
            onChange={(e) => handleAttributeChange(attribute.definitionName, e.target.value)}
            fullWidth
            select
            size="small"
          >
            {attribute.selectableValues?.map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </TextField>
        ))}
      </Stack>

      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="contained" onClick={handleSubmit}>
          저장
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          취소
        </Button>
      </Box>
    </Box>
  );
}
